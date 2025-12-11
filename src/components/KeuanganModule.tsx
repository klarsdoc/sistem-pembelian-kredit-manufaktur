'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  DollarSign, 
  FileText, 
  Send, 
  Eye,
  Calendar,
  User,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  BanknoteIcon,
  Stamp,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface BKK {
  id: string
  nomor: string
  tanggal: string
  fakturNomor: string
  supplier: string
  totalNilai: number
  syaratPembayaran: string
  tanggalJatuhTempo: string
  status: 'authorized' | 'paid' | 'overdue'
  diotorisasiOleh: string
  dibayarOleh?: string
  tanggalBayar?: string
  metodePembayaran?: string
  referensiPembayaran?: string
}

export default function KeuanganModule() {
  const [bkks, setBkks] = useState<BKK[]>([
    {
      id: '1',
      nomor: 'BKK-001/2025',
      tanggal: '2025-06-17',
      fakturNomor: 'F-001/2025',
      supplier: 'PT. Supplier Maju',
      totalNilai: 5000000,
      syaratPembayaran: 'Net 30',
      tanggalJatuhTempo: '2025-07-17',
      status: 'authorized',
      diotorisasiOleh: 'Manajer Akuntansi'
    },
    {
      id: '2',
      nomor: 'BKK-002/2025',
      tanggal: '2025-06-10',
      fakturNomor: 'F-002/2025',
      supplier: 'CV. Material Jaya',
      totalNilai: 3000000,
      syaratPembayaran: 'Net 15',
      tanggalJatuhTempo: '2025-06-25',
      status: 'overdue',
      diotorisasiOleh: 'Manajer Akuntansi'
    }
  ])

  const [selectedBKK, setSelectedBKK] = useState<BKK | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    metodePembayaran: '',
    referensiPembayaran: ''
  })

  const processPayment = () => {
    if (!selectedBKK || !paymentData.metodePembayaran || !paymentData.referensiPembayaran) return

    const updatedBKK = {
      ...selectedBKK,
      status: 'paid' as const,
      dibayarOleh: 'Kasir',
      tanggalBayar: new Date().toISOString().split('T')[0],
      metodePembayaran: paymentData.metodePembayaran,
      referensiPembayaran: paymentData.referensiPembayaran
    }

    setSelectedBKK(updatedBKK)
    setBkks(bkks.map(bkk => bkk.id === selectedBKK.id ? updatedBKK : bkk))
    
    setIsPaymentDialogOpen(false)
    setPaymentData({ metodePembayaran: '', referensiPembayaran: '' })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'authorized':
        return <Badge className="bg-blue-500">Siap Dibayar</Badge>
      case 'paid':
        return <Badge className="bg-green-500">Lunas</Badge>
      case 'overdue':
        return <Badge className="bg-red-500">Jatuh Tempo</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMetodePembayaranBadge = (metode: string) => {
    switch (metode) {
      case 'transfer':
        return <Badge className="bg-blue-500">Transfer Bank</Badge>
      case 'cek':
        return <Badge className="bg-purple-500">Cek</Badge>
      case 'tunai':
        return <Badge className="bg-green-500">Tunai</Badge>
      default:
        return <Badge variant="outline">{metode}</Badge>
    }
  }

  const isOverdue = (tanggalJatuhTempo: string) => {
    return new Date(tanggalJatuhTempo) < new Date()
  }

  const getDaysUntilDue = (tanggalJatuhTempo: string) => {
    const today = new Date()
    const dueDate = new Date(tanggalJatuhTempo)
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const totalOutstanding = bkks
    .filter(bkk => bkk.status === 'authorized' || bkk.status === 'overdue')
    .reduce((sum, bkk) => sum + bkk.totalNilai, 0)

  const overdueAmount = bkks
    .filter(bkk => bkk.status === 'overdue')
    .reduce((sum, bkk) => sum + bkk.totalNilai, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Keuangan</h1>
                <p className="text-gray-600">Otorisasi dan Pelunasan Bukti Kas Keluar (BKK)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Outstanding</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {totalOutstanding.toLocaleString('id-ID')}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jatuh Tempo</p>
                  <p className="text-2xl font-bold text-red-600">
                    Rp {overdueAmount.toLocaleString('id-ID')}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Siap Dibayar</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bkks.filter(bkk => bkk.status === 'authorized').length}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sudah Lunas</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {bkks.filter(bkk => bkk.status === 'paid').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar BKK */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar BKK</CardTitle>
                <CardDescription>Bukti Kas Keluar yang perlu diproses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bkks.map((bkk) => {
                    const daysUntilDue = getDaysUntilDue(bkk.tanggalJatuhTempo)
                    const isOverdueItem = isOverdue(bkk.tanggalJatuhTempo)
                    
                    return (
                      <div
                        key={bkk.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedBKK?.id === bkk.id 
                            ? 'border-yellow-500 bg-yellow-50' 
                            : isOverdueItem
                            ? 'border-red-200 bg-red-50 hover:bg-red-100'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedBKK(bkk)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{bkk.nomor}</span>
                          {getStatusBadge(bkk.status)}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {bkk.tanggal}
                          </div>
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {bkk.supplier}
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {bkk.fakturNomor}
                          </div>
                          <div className="font-medium text-yellow-600">
                            Rp {bkk.totalNilai.toLocaleString('id-ID')}
                          </div>
                          {!isOverdueItem && bkk.status !== 'paid' && (
                            <div className="flex items-center text-blue-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {daysUntilDue} hari lagi
                            </div>
                          )}
                          {isOverdueItem && bkk.status !== 'paid' && (
                            <div className="flex items-center text-red-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Terlambat {Math.abs(daysUntilDue)} hari
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail BKK */}
          <div className="lg:col-span-2">
            {selectedBKK ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedBKK.nomor}</CardTitle>
                      <CardDescription>
                        Detail Bukti Kas Keluar
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedBKK.status)}
                      {selectedBKK.status === 'authorized' && (
                        <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                              <BanknoteIcon className="h-4 w-4 mr-2" />
                              Proses Pembayaran
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Proses Pembayaran</DialogTitle>
                              <DialogDescription>
                                Proses pembayaran untuk {selectedBKK.supplier}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm font-medium">Detail Pembayaran:</p>
                                <p className="text-sm text-gray-600">Nomor BKK: {selectedBKK.nomor}</p>
                                <p className="text-sm text-gray-600">Supplier: {selectedBKK.supplier}</p>
                                <p className="text-sm text-gray-600">Jumlah: Rp {selectedBKK.totalNilai.toLocaleString('id-ID')}</p>
                              </div>
                              
                              <div>
                                <Label>Metode Pembayaran</Label>
                                <Select onValueChange={(value) => setPaymentData({...paymentData, metodePembayaran: value})}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih metode pembayaran" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="transfer">Transfer Bank</SelectItem>
                                    <SelectItem value="cek">Cek</SelectItem>
                                    <SelectItem value="tunai">Tunai</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="referensi">Referensi Pembayaran</Label>
                                <Input
                                  id="referensi"
                                  value={paymentData.referensiPembayaran}
                                  onChange={(e) => setPaymentData({...paymentData, referensiPembayaran: e.target.value})}
                                  placeholder="Contoh: TRF-001/2025 atau No. Cek"
                                />
                              </div>

                              <Button 
                                onClick={processPayment} 
                                className="w-full"
                                disabled={!paymentData.metodePembayaran || !paymentData.referensiPembayaran}
                              >
                                <Stamp className="h-4 w-4 mr-2" />
                                Proses Pembayaran
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informasi BKK */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nomor BKK</Label>
                      <p className="font-medium">{selectedBKK.nomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tanggal BKK</Label>
                      <p className="font-medium">{selectedBKK.tanggal}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nomor Faktur</Label>
                      <p className="font-medium">{selectedBKK.fakturNomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                      <p className="font-medium">{selectedBKK.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Syarat Pembayaran</Label>
                      <p className="font-medium">{selectedBKK.syaratPembayaran}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Jatuh Tempo</Label>
                      <p className={`font-medium ${isOverdue(selectedBKK.tanggalJatuhTempo) ? 'text-red-600' : ''}`}>
                        {selectedBKK.tanggalJatuhTempo}
                        {isOverdue(selectedBKK.tanggalJatuhTempo) && (
                          <span className="ml-2 text-xs">(Terlambat)</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Diotorisasi Oleh</Label>
                      <p className="font-medium">{selectedBKK.diotorisasiOleh}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <p className="font-medium">{getStatusBadge(selectedBKK.status)}</p>
                    </div>
                  </div>

                  {/* Informasi Pembayaran */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informasi Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Total Nilai:</span>
                            <span className="text-xl font-bold text-yellow-600">
                              Rp {selectedBKK.totalNilai.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        {selectedBKK.status === 'paid' ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Tanggal Bayar</Label>
                                <p className="font-medium">{selectedBKK.tanggalBayar}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Dibayar Oleh</Label>
                                <p className="font-medium">{selectedBKK.dibayarOleh}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Metode Pembayaran</Label>
                                <p className="font-medium">{getMetodePembayaranBadge(selectedBKK.metodePembayaran || '')}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Referensi Pembayaran</Label>
                                <p className="font-medium">{selectedBKK.referensiPembayaran}</p>
                              </div>
                            </div>
                            
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center">
                                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                <p className="text-sm text-green-800">
                                  Pembayaran telah selesai dan BKK telah dicap "LUNAS"
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <BanknoteIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>Belum ada pembayaran yang dilakukan</p>
                            {selectedBKK.status === 'authorized' && (
                              <p className="text-sm mt-2">Klik tombol "Proses Pembayaran" untuk melunasi</p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Catatan */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Catatan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        placeholder="Tambahkan catatan untuk pembayaran ini..."
                        rows={3}
                        disabled={selectedBKK.status === 'paid'}
                      />
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Pilih BKK untuk melihat detail</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}