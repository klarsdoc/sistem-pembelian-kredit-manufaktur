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
  Calculator,
  Calendar,
  User,
  Package,
  CheckCircle,
  AlertTriangle,
  CheckSquare,
  XSquare,
  DollarSign,
  Receipt,
  Scale
} from 'lucide-react'

interface ThreeWayMatchItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantitySOPb: number
  quantityLPB: number
  quantityFaktur: number
  hargaSatuan: number
  totalSOPb: number
  totalLPB: number
  totalFaktur: number
  isMatch: boolean
  catatan: string
}

interface BKK {
  id: string
  nomor: string
  tanggal: string
  fakturNomor: string
  supplier: string
  items: ThreeWayMatchItem[]
  totalNilai: number
  syaratPembayaran: string
  tanggalJatuhTempo: string
  status: 'draft' | 'verified' | 'authorized' | 'paid'
  dibuatOleh: string
  diotorisasiOleh?: string
  dibayarOleh?: string
}

interface VerifikasiData {
  sopb: {
    nomor: string
    items: any[]
    totalNilai: number
  }
  lpb: {
    nomor: string
    items: any[]
    supplier: string
  }
  faktur: {
    nomor: string
    items: any[]
    totalNilai: number
    tanggal: string
    syaratPembayaran: string
  }
}

export default function AkuntansiModule() {
  const [bkks, setBkks] = useState<BKK[]>([
    {
      id: '1',
      nomor: 'BKK-001/2025',
      tanggal: '2025-06-17',
      fakturNomor: 'F-001/2025',
      supplier: 'PT. Supplier Maju',
      items: [],
      totalNilai: 0,
      syaratPembayaran: 'Net 30',
      tanggalJatuhTempo: '2025-07-17',
      status: 'draft',
      dibuatOleh: 'Akuntan'
    }
  ])

  const [verifikasiData] = useState<VerifikasiData[]>([
    {
      sopb: {
        nomor: 'SOPb-001/2025',
        items: [
          {
            id: '1',
            kodeBarang: 'BRG001',
            namaBarang: 'Bahan Baku A',
            spesifikasi: 'Grade A',
            quantity: 100,
            satuan: 'Kg',
            hargaSatuan: 50000,
            total: 5000000
          }
        ],
        totalNilai: 5000000
      },
      lpb: {
        nomor: 'LPB-001/2025',
        items: [
          {
            id: '1',
            kodeBarang: 'BRG001',
            namaBarang: 'Bahan Baku A',
            spesifikasi: 'Grade A',
            quantityDiterima: 100,
            satuan: 'Kg'
          }
        ],
        supplier: 'PT. Supplier Maju'
      },
      faktur: {
        nomor: 'F-001/2025',
        items: [
          {
            id: '1',
            kodeBarang: 'BRG001',
            namaBarang: 'Bahan Baku A',
            spesifikasi: 'Grade A',
            quantity: 100,
            satuan: 'Kg',
            hargaSatuan: 50000,
            total: 5000000
          }
        ],
        totalNilai: 5000000,
        tanggal: '2025-06-17',
        syaratPembayaran: 'Net 30'
      }
    }
  ])

  const [selectedBKK, setSelectedBKK] = useState<BKK | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedVerifikasi, setSelectedVerifikasi] = useState<VerifikasiData | null>(null)

  const performThreeWayMatch = (data: VerifikasiData): ThreeWayMatchItem[] => {
    return data.sopb.items.map(sopbItem => {
      const lpbItem = data.lpb.items.find(item => item.kodeBarang === sopbItem.kodeBarang)
      const fakturItem = data.faktur.items.find(item => item.kodeBarang === sopbItem.kodeBarang)

      const quantityMatch = sopbItem.quantity === (lpbItem?.quantityDiterima || 0) && 
                           sopbItem.quantity === (fakturItem?.quantity || 0)
      const priceMatch = sopbItem.hargaSatuan === (fakturItem?.hargaSatuan || 0)
      const isMatch = quantityMatch && priceMatch

      return {
        id: sopbItem.id,
        kodeBarang: sopbItem.kodeBarang,
        namaBarang: sopbItem.namaBarang,
        spesifikasi: sopbItem.spesifikasi,
        quantitySOPb: sopbItem.quantity,
        quantityLPB: lpbItem?.quantityDiterima || 0,
        quantityFaktur: fakturItem?.quantity || 0,
        hargaSatuan: sopbItem.hargaSatuan,
        totalSOPb: sopbItem.total,
        totalLPB: (lpbItem?.quantityDiterima || 0) * sopbItem.hargaSatuan,
        totalFaktur: fakturItem?.total || 0,
        isMatch,
        catatan: isMatch ? 'Match' : 'Terdapat perbedaan'
      }
    })
  }

  const createBKK = () => {
    if (!selectedVerifikasi) return

    const matchItems = performThreeWayMatch(selectedVerifikasi)
    const allMatch = matchItems.every(item => item.isMatch)

    if (!allMatch) {
      alert('Three-Way Match gagal! Terdapat perbedaan antara SOPb, LPB, dan Faktur.')
      return
    }

    const newBKK: BKK = {
      id: Date.now().toString(),
      nomor: `BKK-${String(bkks.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      fakturNomor: selectedVerifikasi.faktur.nomor,
      supplier: selectedVerifikasi.lpb.supplier,
      items: matchItems,
      totalNilai: selectedVerifikasi.faktur.totalNilai,
      syaratPembayaran: selectedVerifikasi.faktur.syaratPembayaran,
      tanggalJatuhTempo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'verified',
      dibuatOleh: 'Akuntan'
    }

    setBkks([...bkks, newBKK])
    setSelectedBKK(newBKK)
    setIsCreateDialogOpen(false)
    setSelectedVerifikasi(null)
  }

  const authorizeBKK = () => {
    if (!selectedBKK) return

    const updatedBKK = {
      ...selectedBKK,
      status: 'authorized' as const,
      diotorisasiOleh: 'Manajer Akuntansi'
    }

    setSelectedBKK(updatedBKK)
    setBkks(bkks.map(bkk => bkk.id === selectedBKK.id ? updatedBKK : bkk))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'verified':
        return <Badge className="bg-green-500">Terverifikasi</Badge>
      case 'authorized':
        return <Badge className="bg-blue-500">Diotorisasi</Badge>
      case 'paid':
        return <Badge className="bg-purple-500">Dibayar</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMatchBadge = (isMatch: boolean) => {
    return isMatch ? (
      <Badge className="bg-green-500">Match</Badge>
    ) : (
      <Badge className="bg-red-500">Tidak Match</Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Akuntansi</h1>
                <p className="text-gray-600">Three-Way Match dan Bukti Kas Keluar (BKK)</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat BKK Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Three-Way Match & Buat Bukti Kas Keluar</DialogTitle>
                  <DialogDescription>
                    Verifikasi kesesuaian SOPb, LPB, dan Faktur sebelum membuat BKK
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Pilih Data untuk Verifikasi</Label>
                    <Select onValueChange={(value) => setSelectedVerifikasi(verifikasiData.find(data => data.sopb.nomor === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih data verifikasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {verifikasiData.map((data, index) => (
                          <SelectItem key={index} value={data.sopb.nomor}>
                            {data.sopb.nomor} | {data.lpb.nomor} | {data.faktur.nomor} - {data.lpb.supplier}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedVerifikasi && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">SOPb</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p><strong>Nomor:</strong> {selectedVerifikasi.sopb.nomor}</p>
                            <p><strong>Total:</strong> Rp {selectedVerifikasi.sopb.totalNilai.toLocaleString('id-ID')}</p>
                            <p><strong>Items:</strong> {selectedVerifikasi.sopb.items.length}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">LPB</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p><strong>Nomor:</strong> {selectedVerifikasi.lpb.nomor}</p>
                            <p><strong>Supplier:</strong> {selectedVerifikasi.lpb.supplier}</p>
                            <p><strong>Items:</strong> {selectedVerifikasi.lpb.items.length}</p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Faktur</CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            <p><strong>Nomor:</strong> {selectedVerifikasi.faktur.nomor}</p>
                            <p><strong>Total:</strong> Rp {selectedVerifikasi.faktur.totalNilai.toLocaleString('id-ID')}</p>
                            <p><strong>Items:</strong> {selectedVerifikasi.faktur.items.length}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center">
                            <Scale className="h-4 w-4 mr-2" />
                            Hasil Three-Way Match
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Kode</TableHead>
                                <TableHead>Nama Barang</TableHead>
                                <TableHead>Qty SOPb</TableHead>
                                <TableHead>Qty LPB</TableHead>
                                <TableHead>Qty Faktur</TableHead>
                                <TableHead>Match</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {performThreeWayMatch(selectedVerifikasi).map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell className="font-medium">{item.kodeBarang}</TableCell>
                                  <TableCell>{item.namaBarang}</TableCell>
                                  <TableCell>{item.quantitySOPb}</TableCell>
                                  <TableCell>{item.quantityLPB}</TableCell>
                                  <TableCell>{item.quantityFaktur}</TableCell>
                                  <TableCell>{getMatchBadge(item.isMatch)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <Button 
                    onClick={createBKK} 
                    className="w-full"
                    disabled={!selectedVerifikasi || !performThreeWayMatch(selectedVerifikasi).every(item => item.isMatch)}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Buat BKK
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar BKK */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar BKK</CardTitle>
                <CardDescription>Bukti Kas Keluar yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bkks.map((bkk) => (
                    <div
                      key={bkk.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedBKK?.id === bkk.id 
                          ? 'border-red-500 bg-red-50' 
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
                          <Receipt className="h-3 w-3 mr-1" />
                          {bkk.fakturNomor}
                        </div>
                        <div className="font-medium text-red-600">
                          Rp {bkk.totalNilai.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
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
                        Bukti Kas Keluar
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedBKK.status)}
                      {selectedBKK.status === 'verified' && (
                        <Button onClick={authorizeBKK} className="bg-blue-600 hover:bg-blue-700">
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Otorisasi
                        </Button>
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
                      <Label className="text-sm font-medium text-gray-600">Tanggal</Label>
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
                      <p className="font-medium">{selectedBKK.tanggalJatuhTempo}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Dibuat Oleh</Label>
                      <p className="font-medium">{selectedBKK.dibuatOleh}</p>
                    </div>
                    {selectedBKK.diotorisasiOleh && (
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Diotorisasi Oleh</Label>
                        <p className="font-medium">{selectedBKK.diotorisasiOleh}</p>
                      </div>
                    )}
                  </div>

                  {/* Three-Way Match Result */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Scale className="h-5 w-5 mr-2" />
                        Hasil Three-Way Match
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedBKK.items.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode</TableHead>
                              <TableHead>Nama Barang</TableHead>
                              <TableHead>Qty SOPb</TableHead>
                              <TableHead>Qty LPB</TableHead>
                              <TableHead>Qty Faktur</TableHead>
                              <TableHead>Harga</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Match</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedBKK.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kodeBarang}</TableCell>
                                <TableCell>{item.namaBarang}</TableCell>
                                <TableCell>{item.quantitySOPb}</TableCell>
                                <TableCell>{item.quantityLPB}</TableCell>
                                <TableCell>{item.quantityFaktur}</TableCell>
                                <TableCell>Rp {item.hargaSatuan.toLocaleString('id-ID')}</TableCell>
                                <TableCell className="font-medium">Rp {item.totalSOPb.toLocaleString('id-ID')}</TableCell>
                                <TableCell>{getMatchBadge(item.isMatch)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-bold bg-gray-50">
                              <TableCell colSpan={6} className="text-right">Total Nilai:</TableCell>
                              <TableCell className="text-red-600">
                                Rp {selectedBKK.totalNilai.toLocaleString('id-ID')}
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Belum ada item yang diverifikasi</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Catatan Akuntansi */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Catatan Akuntansi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Jurnal Pembelian</Label>
                          <div className="p-3 bg-gray-50 rounded-lg mt-1">
                            <p className="font-medium">Debit: Persediaan Barang</p>
                            <p className="font-medium">Kredit: Utang Usaha</p>
                            <p className="text-sm text-gray-600 mt-2">
                              Rp {selectedBKK.totalNilai.toLocaleString('id-ID')}
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Catatan Tambahan</Label>
                          <Textarea 
                            placeholder="Tambahkan catatan untuk transaksi ini..."
                            rows={3}
                            disabled={selectedBKK.status !== 'verified'}
                          />
                        </div>
                      </div>
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