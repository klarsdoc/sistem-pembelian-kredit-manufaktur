'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Factory, 
  ShoppingCart, 
  PackageCheck, 
  Warehouse, 
  Calculator, 
  DollarSign,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react'

// Import components
import Sidebar from '@/components/Sidebar'
import ProduksiModule from '@/components/ProduksiModule'
import PembelianModule from '@/components/PembelianModule'
import PenerimaanModule from '@/components/PenerimaanModule'
import GudangModule from '@/components/GudangModule'
import AkuntansiModule from '@/components/AkuntansiModule'
import KeuanganModule from '@/components/KeuanganModule'

// Import database
import db, { SPP, SOPb, LPB, BKK } from '@/lib/database'

export default function HomePage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedProcedure, setSelectedProcedure] = useState<string | null>(null)

  // Get real-time data from database
  const spps = db.getSPPs()
  const sopbs = db.getSOPbs()
  const lpbs = db.getLPBs()
  const bkks = db.getBKKs()

  const modules = [
    {
      id: 'produksi',
      name: 'Produksi/PPIC',
      description: 'Input Surat Permintaan Pembelian (SPP)',
      icon: Factory,
      color: 'bg-blue-500',
      documents: ['SPP'],
      status: 'active',
      count: spps.length
    },
    {
      id: 'pembelian',
      name: 'Pembelian',
      description: 'Membuat dan mengelola Surat Order Pembelian (SOPb)',
      icon: ShoppingCart,
      color: 'bg-green-500',
      documents: ['SOPb', 'SPPH'],
      status: 'active',
      count: sopbs.length
    },
    {
      id: 'penerimaan',
      name: 'Penerimaan',
      description: 'Input Laporan Penerimaan Barang (LPB)',
      icon: PackageCheck,
      color: 'bg-orange-500',
      documents: ['LPB'],
      status: 'active',
      count: lpbs.length
    },
    {
      id: 'gudang',
      name: 'Gudang',
      description: 'Pencatatan kuantitas di Kartu Gudang',
      icon: Warehouse,
      color: 'bg-purple-500',
      documents: ['Kartu Gudang'],
      status: 'active',
      count: db.getKartuGudang().length
    },
    {
      id: 'akuntansi',
      name: 'Akuntansi',
      description: 'Verifikasi Three-Way Match dan pencatatan utang',
      icon: Calculator,
      color: 'bg-red-500',
      documents: ['BKK', 'Kartu Persediaan'],
      status: 'active',
      count: bkks.length
    },
    {
      id: 'keuangan',
      name: 'Keuangan',
      description: 'Otorisasi dan pelunasan Bukti Kas Keluar',
      icon: DollarSign,
      color: 'bg-yellow-500',
      documents: ['BKK'],
      status: 'active',
      count: bkks.filter(b => b.status === 'authorized' || b.status === 'overdue').length
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const renderDepartmentModule = () => {
    switch (selectedDepartment) {
      case 'produksi':
        return <ProduksiModule />
      case 'pembelian':
        return <PembelianModule />
      case 'penerimaan':
        return <PenerimaanModule />
      case 'gudang':
        return <GudangModule />
      case 'akuntansi':
        return <AkuntansiModule />
      case 'keuangan':
        return <KeuanganModule />
      default:
        return null
    }
  }

  // Calculate summary statistics
  const totalSPP = spps.length
  const totalSOPb = sopbs.length
  const totalLPB = lpbs.length
  const totalBKK = bkks.length
  const outstandingPayments = bkks
    .filter(bkk => bkk.status === 'authorized' || bkk.status === 'overdue')
    .reduce((sum, bkk) => sum + bkk.totalNilai, 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        selectedDepartment={selectedDepartment}
        selectedProcedure={selectedProcedure}
        onDepartmentSelect={setSelectedDepartment}
        onProcedureSelect={setSelectedProcedure}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {selectedDepartment ? (
          <div>
            {/* Department Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedDepartment(null)
                      setSelectedProcedure(null)
                    }}
                  >
                    ← Kembali
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {modules.find(m => m.id === selectedDepartment)?.name}
                    </h1>
                    {selectedProcedure && (
                      <p className="text-sm text-gray-600">{selectedProcedure}</p>
                    )}
                  </div>
                </div>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <FileText className="h-4 w-4 mr-1" />
                  {modules.find(m => m.id === selectedDepartment)?.count} Dokumen
                </Badge>
              </div>
            </div>
            
            {/* Department Module */}
            {renderDepartmentModule()}
          </div>
        ) : (
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                      Sistem Pembelian Secara Kredit
                    </h1>
                    <p className="text-lg text-gray-600">
                      Perusahaan Manufaktur - Sistem Pencatatan Transaksi
                    </p>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    <FileText className="h-4 w-4 mr-1" />
                    Integrated System
                  </Badge>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-sm text-blue-800">
                      Aplikasi ini digunakan untuk pencatatan transaksi pembelian kredit yang menghubungkan semua departemen dalam satu sistem terintegrasi
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total SPP</p>
                        <p className="text-2xl font-bold text-blue-600">{totalSPP}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total SOPb</p>
                        <p className="text-2xl font-bold text-green-600">{totalSOPb}</p>
                      </div>
                      <Package className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total LPB</p>
                        <p className="text-2xl font-bold text-orange-600">{totalLPB}</p>
                      </div>
                      <PackageCheck className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">
                          Rp {outstandingPayments.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="modules" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="modules">Modul Departemen</TabsTrigger>
                  <TabsTrigger value="workflow">Alur Kerja</TabsTrigger>
                </TabsList>

                <TabsContent value="modules" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => {
                      const Icon = module.icon
                      return (
                        <Card 
                          key={module.id} 
                          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-blue-500"
                          onClick={() => setSelectedDepartment(module.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className={`p-2 rounded-lg ${module.color} bg-opacity-10`}>
                                <Icon className={`h-6 w-6 ${module.color.replace('bg-', 'text-')}`} />
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(module.status)}
                                <Badge variant="secondary" className="text-xs">
                                  {module.count}
                                </Badge>
                              </div>
                            </div>
                            <CardTitle className="text-lg">{module.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {module.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-1">Dokumen yang dikelola:</p>
                                <div className="flex flex-wrap gap-1">
                                  {module.documents.map((doc) => (
                                    <Badge key={doc} variant="secondary" className="text-xs">
                                      {doc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button 
                                className="w-full" 
                                variant="outline"
                                size="sm"
                              >
                                Buka Modul
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="workflow" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Alur Kerja Sistem Pembelian Kredit
                      </CardTitle>
                      <CardDescription>
                        Tahapan proses dari permintaan hingga pelunasan pembayaran
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            stage: "Tahap I: Inisiasi Permintaan dan Pemesanan",
                            steps: [
                              "Produksi membuat SPP (Surat Permintaan Pembelian)",
                              "Pembelian menerima SPP dan memilih supplier",
                              "Pembelian membuat SOPb (Surat Order Pembelian)",
                              "SOPb didistribusikan ke supplier, penerimaan, gudang, dan akuntansi"
                            ]
                          },
                          {
                            stage: "Tahap II: Penerimaan Barang dan Penyimpanan",
                            steps: [
                              "Supplier mengirim barang dengan SJ dan Faktur",
                              "Penerimaan memeriksa barang (jenis, mutu, kuantitas)",
                              "Penerimaan membuat LPB (Laporan Penerimaan Barang)",
                              "Gudang menyimpan barang dan mencatat di Kartu Gudang"
                            ]
                          },
                          {
                            stage: "Tahap III: Pencatatan Utang dan Pembayaran",
                            steps: [
                              "Akuntansi melakukan Three-Way Match (SOPb, LPB, Faktur)",
                              "Akuntansi membuat BKK (Bukti Kas Keluar)",
                              "Akuntansi mencatat persediaan di Kartu Persediaan",
                              "Keuangan mengotorisasi dan melakukan pembayaran",
                              "BKK dicap 'Lunas' dan diarsip"
                            ]
                          }
                        ].map((phase, index) => (
                          <div key={index} className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{phase.stage}</h3>
                            <ol className="space-y-1">
                              {phase.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start">
                                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium text-gray-600 mr-2 mt-0.5 flex-shrink-0">
                                    {stepIndex + 1}
                                  </span>
                                  <span className="text-sm text-gray-700">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}