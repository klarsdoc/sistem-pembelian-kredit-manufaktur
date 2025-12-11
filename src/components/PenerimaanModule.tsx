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
  Plus, 
  FileText, 
  Send, 
  Eye,
  PackageCheck,
  Calendar,
  User,
  Package,
  CheckCircle,
  AlertTriangle,
  CheckSquare,
  XSquare
} from 'lucide-react'

interface SOPbItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantity: number
  satuan: string
  hargaSatuan: number
  total: number
}

interface SOPb {
  id: string
  nomor: string
  tanggal: string
  supplier: string
  items: SOPbItem[]
  status: string
  totalNilai: number
}

interface LPBItem {
  id: string
  sopbItemId: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantityDipesan: number
  quantityDiterima: number
  satuan: string
  kualitas: 'baik' | 'rusak' | 'tidak_sesuai'
  catatanKualitas: string
}

interface LPB {
  id: string
  nomor: string
  tanggal: string
  sopbId: string
  sopbNomor: string
  supplier: string
  suratJalan: string
  items: LPBItem[]
  diterimaOleh: string
  status: 'draft' | 'verified' | 'submitted'
  totalItemDiterima: number
}

export default function PenerimaanModule() {
  const [lpbs, setLpbs] = useState<LPB[]>([
    {
      id: '1',
      nomor: 'LPB-001/2025',
      tanggal: '2025-06-17',
      sopbId: '1',
      sopbNomor: 'SOPb-001/2025',
      supplier: 'PT. Supplier Maju',
      suratJalan: 'SJ-001/2025',
      items: [],
      diterimaOleh: 'Penerima Barang',
      status: 'draft',
      totalItemDiterima: 0
    }
  ])

  const [sopbs] = useState<SOPb[]>([
    {
      id: '1',
      nomor: 'SOPb-001/2025',
      tanggal: '2025-06-17',
      supplier: 'PT. Supplier Maju',
      status: 'sent',
      items: [
        {
          id: '1',
          kodeBarang: 'BRG001',
          namaBarang: 'Bahan Baku A',
          spesifikasi: 'Grade A, 100kg',
          quantity: 100,
          satuan: 'Kg',
          hargaSatuan: 50000,
          total: 5000000
        }
      ],
      totalNilai: 5000000
    },
    {
      id: '2',
      nomor: 'SOPb-002/2025',
      tanggal: '2025-06-16',
      supplier: 'CV. Material Jaya',
      status: 'sent',
      items: [
        {
          id: '2',
          kodeBarang: 'BRG002',
          namaBarang: 'Bahan Baku B',
          spesifikasi: 'Grade B, 50kg',
          quantity: 50,
          satuan: 'Kg',
          hargaSatuan: 30000,
          total: 1500000
        }
      ],
      totalNilai: 1500000
    }
  ])

  const [selectedLPB, setSelectedLPB] = useState<LPB | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSOPb, setSelectedSOPb] = useState<SOPb | null>(null)
  const [suratJalan, setSuratJalan] = useState('')

  const createLPB = () => {
    if (!selectedSOPb || !suratJalan) return

    const newLPB: LPB = {
      id: Date.now().toString(),
      nomor: `LPB-${String(lpbs.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      sopbId: selectedSOPb.id,
      sopbNomor: selectedSOPb.nomor,
      supplier: selectedSOPb.supplier,
      suratJalan: suratJalan,
      items: selectedSOPb.items.map(item => ({
        id: item.id,
        sopbItemId: item.id,
        kodeBarang: item.kodeBarang,
        namaBarang: item.namaBarang,
        spesifikasi: item.spesifikasi,
        quantityDipesan: item.quantity,
        quantityDiterima: item.quantity,
        satuan: item.satuan,
        kualitas: 'baik' as const,
        catatanKualitas: ''
      })),
      diterimaOleh: 'Penerima Barang',
      status: 'draft' as const,
      totalItemDiterima: selectedSOPb.items.reduce((sum, item) => sum + item.quantity, 0)
    }

    setLpbs([...lpbs, newLPB])
    setSelectedLPB(newLPB)
    setIsCreateDialogOpen(false)
    setSelectedSOPb(null)
    setSuratJalan('')
  }

  const updateItemPenerimaan = (itemId: string, field: keyof LPBItem, value: any) => {
    if (!selectedLPB) return

    const updatedItems = selectedLPB.items.map(item => {
      if (item.id === itemId) {
        return { ...item, [field]: value }
      }
      return item
    })

    const updatedLPB = {
      ...selectedLPB,
      items: updatedItems,
      totalItemDiterima: updatedItems.reduce((sum, item) => sum + item.quantityDiterima, 0)
    }

    setSelectedLPB(updatedLPB)
    setLpbs(lpbs.map(lpb => lpb.id === selectedLPB.id ? updatedLPB : lpb))
  }

  const verifyLPB = () => {
    if (!selectedLPB) return

    const updatedLPB = {
      ...selectedLPB,
      status: 'verified' as const
    }

    setSelectedLPB(updatedLPB)
    setLpbs(lpbs.map(lpb => lpb.id === selectedLPB.id ? updatedLPB : lpb))
  }

  const submitLPB = () => {
    if (!selectedLPB) return

    const updatedLPB = {
      ...selectedLPB,
      status: 'submitted' as const
    }

    setSelectedLPB(updatedLPB)
    setLpbs(lpbs.map(lpb => lpb.id === selectedLPB.id ? updatedLPB : lpb))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'verified':
        return <Badge className="bg-blue-500">Terverifikasi</Badge>
      case 'submitted':
        return <Badge className="bg-green-500">Diserahkan ke Gudang</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getKualitasBadge = (kualitas: string) => {
    switch (kualitas) {
      case 'baik':
        return <Badge className="bg-green-500">Baik</Badge>
      case 'rusak':
        return <Badge className="bg-red-500">Rusak</Badge>
      case 'tidak_sesuai':
        return <Badge className="bg-orange-500">Tidak Sesuai</Badge>
      default:
        return <Badge variant="outline">{kualitas}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <PackageCheck className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Penerimaan</h1>
                <p className="text-gray-600">Laporan Penerimaan Barang (LPB)</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat LPB Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Buat Laporan Penerimaan Barang Baru</DialogTitle>
                  <DialogDescription>
                    Pilih SOPb dan masukkan nomor Surat Jalan untuk membuat LPB
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Pilih SOPb (Surat Order Pembelian)</Label>
                    <Select onValueChange={(value) => setSelectedSOPb(sopbs.find(sopb => sopb.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih SOPb" />
                      </SelectTrigger>
                      <SelectContent>
                        {sopbs.filter(sopb => sopb.status === 'sent').map((sopb) => (
                          <SelectItem key={sopb.id} value={sopb.id}>
                            {sopb.nomor} - {sopb.supplier} ({sopb.items.length} item)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedSOPb && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Detail SOPb:</p>
                      <p className="text-sm text-gray-600">Nomor: {selectedSOPb.nomor}</p>
                      <p className="text-sm text-gray-600">Supplier: {selectedSOPb.supplier}</p>
                      <p className="text-sm text-gray-600">Jumlah Item: {selectedSOPb.items.length}</p>
                      <p className="text-sm text-gray-600">Total Nilai: Rp {selectedSOPb.totalNilai.toLocaleString('id-ID')}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="suratJalan">Nomor Surat Jalan</Label>
                    <Input
                      id="suratJalan"
                      value={suratJalan}
                      onChange={(e) => setSuratJalan(e.target.value)}
                      placeholder="Contoh: SJ-001/2025"
                    />
                  </div>

                  <Button 
                    onClick={createLPB} 
                    className="w-full"
                    disabled={!selectedSOPb || !suratJalan}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Buat LPB
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar LPB */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar LPB</CardTitle>
                <CardDescription>Laporan Penerimaan Barang yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lpbs.map((lpb) => (
                    <div
                      key={lpb.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedLPB?.id === lpb.id 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedLPB(lpb)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{lpb.nomor}</span>
                        {getStatusBadge(lpb.status)}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {lpb.tanggal}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {lpb.supplier}
                        </div>
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {lpb.items.length} item
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          SJ: {lpb.suratJalan}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail LPB */}
          <div className="lg:col-span-2">
            {selectedLPB ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedLPB.nomor}</CardTitle>
                      <CardDescription>
                        Laporan Penerimaan Barang
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedLPB.status)}
                      {selectedLPB.status === 'draft' && (
                        <Button onClick={verifyLPB} className="bg-blue-600 hover:bg-blue-700">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Verifikasi
                        </Button>
                      )}
                      {selectedLPB.status === 'verified' && (
                        <Button onClick={submitLPB} className="bg-green-600 hover:bg-green-700">
                          <Send className="h-4 w-4 mr-2" />
                          Serahkan ke Gudang
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informasi LPB */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nomor LPB</Label>
                      <p className="font-medium">{selectedLPB.nomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tanggal</Label>
                      <p className="font-medium">{selectedLPB.tanggal}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">SOPb Referensi</Label>
                      <p className="font-medium">{selectedLPB.sopbNomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Surat Jalan</Label>
                      <p className="font-medium">{selectedLPB.suratJalan}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                      <p className="font-medium">{selectedLPB.supplier}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Diterima Oleh</Label>
                      <p className="font-medium">{selectedLPB.diterimaOleh}</p>
                    </div>
                  </div>

                  {/* Daftar Item */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detail Penerimaan Barang</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedLPB.items.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode</TableHead>
                              <TableHead>Nama Barang</TableHead>
                              <TableHead>Spesifikasi</TableHead>
                              <TableHead>Qty Pesan</TableHead>
                              <TableHead>Qty Terima</TableHead>
                              <TableHead>Satuan</TableHead>
                              <TableHead>Kualitas</TableHead>
                              <TableHead>Catatan</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedLPB.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kodeBarang}</TableCell>
                                <TableCell>{item.namaBarang}</TableCell>
                                <TableCell className="text-sm">{item.spesifikasi}</TableCell>
                                <TableCell>{item.quantityDipesan}</TableCell>
                                <TableCell>
                                  {selectedLPB.status === 'draft' ? (
                                    <Input
                                      type="number"
                                      value={item.quantityDiterima}
                                      onChange={(e) => updateItemPenerimaan(item.id, 'quantityDiterima', parseInt(e.target.value) || 0)}
                                      className="w-20"
                                    />
                                  ) : (
                                    <span className={item.quantityDiterima !== item.quantityDipesan ? 'text-red-600 font-medium' : ''}>
                                      {item.quantityDiterima}
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>{item.satuan}</TableCell>
                                <TableCell>
                                  {selectedLPB.status === 'draft' ? (
                                    <Select 
                                      value={item.kualitas} 
                                      onValueChange={(value: 'baik' | 'rusak' | 'tidak_sesuai') => updateItemPenerimaan(item.id, 'kualitas', value)}
                                    >
                                      <SelectTrigger className="w-32">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="baik">Baik</SelectItem>
                                        <SelectItem value="rusak">Rusak</SelectItem>
                                        <SelectItem value="tidak_sesuai">Tidak Sesuai</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    getKualitasBadge(item.kualitas)
                                  )}
                                </TableCell>
                                <TableCell>
                                  {selectedLPB.status === 'draft' ? (
                                    <Input
                                      value={item.catatanKualitas}
                                      onChange={(e) => updateItemPenerimaan(item.id, 'catatanKualitas', e.target.value)}
                                      placeholder="Catatan..."
                                      className="w-32"
                                    />
                                  ) : (
                                    <span className="text-sm">{item.catatanKualitas}</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Belum ada barang yang diterima</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ringkasan */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ringkasan Penerimaan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-600">Total Item Dipesan</p>
                          <p className="text-2xl font-bold text-blue-800">
                            {selectedLPB.items.reduce((sum, item) => sum + item.quantityDipesan, 0)}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-600">Total Item Diterima</p>
                          <p className="text-2xl font-bold text-green-800">
                            {selectedLPB.totalItemDiterima}
                          </p>
                        </div>
                      </div>
                      
                      {selectedLPB.items.some(item => item.quantityDiterima !== item.quantityDipesan) && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                            <p className="text-sm text-yellow-800">
                              Terdapat perbedaan antara jumlah yang dipesan dan diterima. Pastikan untuk mencatat catatan yang jelas.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Pilih LPB untuk melihat detail</p>
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