'use client'

import { useState, useEffect } from 'react'
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
  Edit,
  Trash2,
  ShoppingCart,
  Calendar,
  User,
  Package,
  CheckCircle,
  ExternalLink
} from 'lucide-react'

// Import database
import db, { SOPb, Supplier, SPP } from '@/lib/database'

export default function PembelianModule() {
  const [sopbs, setSopbs] = useState<SOPb[]>([])
  const [spps, setSpps] = useState<SPP[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedSOPb, setSelectedSOPb] = useState<SOPb | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSPP, setSelectedSPP] = useState<SPP | null>(null)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // Load data from database
  useEffect(() => {
    setSopbs(db.getSOPbs())
    setSpps(db.getSPPs())
    setSuppliers(db.getSuppliers())
  }, [])

  const createSOPb = () => {
    if (!selectedSPP || !selectedSupplier) return

    const newSOPb = db.addSOPb({
      nomor: `SOPb-${String(sopbs.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      sppId: selectedSPP.id,
      sppNomor: selectedSPP.nomor,
      supplierId: selectedSupplier.id,
      supplier: selectedSupplier,
      items: selectedSPP.items.map(item => ({
        id: item.id,
        kodeBarang: item.kodeBarang,
        namaBarang: item.namaBarang,
        spesifikasi: item.spesifikasi,
        quantity: item.quantity,
        satuan: item.satuan,
        hargaSatuan: 0,
        total: 0
      })),
      syaratPembayaran: 'Net 30',
      tanggalKirim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      totalNilai: 0
    })

    setSopbs(db.getSOPbs())
    setSelectedSOPb(newSOPb)
    setIsCreateDialogOpen(false)
    setSelectedSPP(null)
    setSelectedSupplier(null)
  }

  const updateHarga = (itemId: string, hargaSatuan: number) => {
    if (!selectedSOPb) return

    const updatedItems = selectedSOPb.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          hargaSatuan,
          total: item.quantity * hargaSatuan
        }
      }
      return item
    })

    const updatedSOPb = {
      ...selectedSOPb,
      items: updatedItems,
      totalNilai: updatedItems.reduce((sum, item) => sum + item.total, 0)
    }

    db.updateSOPb(selectedSOPb.id, updatedSOPb)
    setSopbs(db.getSOPbs())
    setSelectedSOPb(updatedSOPb)
  }

  const updateSOPb = (updatedSOPb: SOPb) => {
    db.updateSOPb(updatedSOPb.id, updatedSOPb)
    setSopbs(db.getSOPbs())
    setSelectedSOPb(updatedSOPb)
    setIsEditDialogOpen(false)
  }

  const deleteSOPb = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus SOPb ini?')) {
      db.deleteSOPb(id)
      setSopbs(db.getSOPbs())
      if (selectedSOPb?.id === id) {
        setSelectedSOPb(null)
      }
    }
  }

  const submitSOPb = () => {
    if (!selectedSOPb) return

    const updatedSOPb = {
      ...selectedSOPb,
      status: 'submitted' as const
    }

    db.updateSOPb(selectedSOPb.id, updatedSOPb)
    setSopbs(db.getSOPbs())
    setSelectedSOPb(updatedSOPb)
  }

  const sendToSupplier = () => {
    if (!selectedSOPb) return

    const updatedSOPb = {
      ...selectedSOPb,
      status: 'sent' as const
    }

    db.updateSOPb(selectedSOPb.id, updatedSOPb)
    setSopbs(db.getSOPbs())
    setSelectedSOPb(updatedSOPb)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'submitted':
        return <Badge className="bg-blue-500">Disetujui</Badge>
      case 'sent':
        return <Badge className="bg-green-500">Terkirim ke Supplier</Badge>
      case 'received':
        return <Badge className="bg-purple-500">Diterima</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Pembelian</h1>
                <p className="text-gray-600">Surat Order Pembelian (SOPb)</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat SOPb Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Buat Surat Order Pembelian Baru</DialogTitle>
                  <DialogDescription>
                    Pilih SPP dan Supplier untuk membuat SOPb
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Pilih SPP (Surat Permintaan Pembelian)</Label>
                    <Select onValueChange={(value) => setSelectedSPP(spps.find(spp => spp.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih SPP" />
                      </SelectTrigger>
                      <SelectContent>
                        {spps.filter(spp => spp.status === 'submitted').map((spp) => (
                          <SelectItem key={spp.id} value={spp.id}>
                            {spp.nomor} - {spp.dibuatOleh} ({spp.items.length} item)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedSPP && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Detail SPP:</p>
                      <p className="text-sm text-gray-600">Nomor: {selectedSPP.nomor}</p>
                      <p className="text-sm text-gray-600">Peminta: {selectedSPP.dibuatOleh}</p>
                      <p className="text-sm text-gray-600">Jumlah Item: {selectedSPP.items.length}</p>
                    </div>
                  )}

                  <div>
                    <Label>Pilih Supplier</Label>
                    <Select onValueChange={(value) => setSelectedSupplier(suppliers.find(sup => sup.id === value) || null)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.nama} - {supplier.kontak}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedSupplier && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">Detail Supplier:</p>
                      <p className="text-sm text-gray-600">Nama: {selectedSupplier.nama}</p>
                      <p className="text-sm text-gray-600">Kontak: {selectedSupplier.kontak}</p>
                      <p className="text-sm text-gray-600">Telepon: {selectedSupplier.telepon}</p>
                    </div>
                  )}

                  <Button 
                    onClick={createSOPb} 
                    className="w-full"
                    disabled={!selectedSPP || !selectedSupplier}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Buat SOPb
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar SOPb */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar SOPb</CardTitle>
                <CardDescription>Surat Order Pembelian yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sopbs.map((sopb) => (
                    <div
                      key={sopb.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSOPb?.id === sopb.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSOPb(sopb)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{sopb.nomor}</span>
                        {getStatusBadge(sopb.status)}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {sopb.tanggal}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {sopb.supplier.nama}
                        </div>
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {sopb.items.length} item
                        </div>
                        <div className="font-medium text-green-600">
                          Rp {sopb.totalNilai.toLocaleString('id-ID')}
                        </div>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {sopb.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedSOPb(sopb)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSOPb(sopb.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail SOPb */}
          <div className="lg:col-span-2">
            {selectedSOPb ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedSOPb.nomor}</CardTitle>
                      <CardDescription>
                        Surat Order Pembelian
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedSOPb.status)}
                      {selectedSOPb.status === 'draft' && (
                        <Button onClick={submitSOPb} className="bg-blue-600 hover:bg-blue-700">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Setujui
                        </Button>
                      )}
                      {selectedSOPb.status === 'submitted' && (
                        <Button onClick={sendToSupplier} className="bg-green-600 hover:bg-green-700">
                          <Send className="h-4 w-4 mr-2" />
                          Kirim ke Supplier
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informasi SOPb */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nomor SOPb</Label>
                      <p className="font-medium">{selectedSOPb.nomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tanggal</Label>
                      <p className="font-medium">{selectedSOPb.tanggal}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">SPP Referensi</Label>
                      <p className="font-medium">{selectedSOPb.sppNomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tanggal Kirim</Label>
                      <p className="font-medium">{selectedSOPb.tanggalKirim}</p>
                    </div>
                  </div>

                  {/* Informasi Supplier */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informasi Supplier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Nama Supplier</Label>
                          <p className="font-medium">{selectedSOPb.supplier.nama}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Kontak</Label>
                          <p className="font-medium">{selectedSOPb.supplier.kontak}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Telepon</Label>
                          <p className="font-medium">{selectedSOPb.supplier.telepon}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Email</Label>
                          <p className="font-medium">{selectedSOPb.supplier.email}</p>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-sm font-medium text-gray-600">Alamat</Label>
                          <p className="font-medium">{selectedSOPb.supplier.alamat}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daftar Item */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Daftar Barang Dipesan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSOPb.items.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode</TableHead>
                              <TableHead>Nama Barang</TableHead>
                              <TableHead>Spesifikasi</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Satuan</TableHead>
                              <TableHead>Harga Satuan</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSOPb.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kodeBarang}</TableCell>
                                <TableCell>{item.namaBarang}</TableCell>
                                <TableCell className="text-sm">{item.spesifikasi}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.satuan}</TableCell>
                                <TableCell>
                                  {selectedSOPb.status === 'draft' ? (
                                    <Input
                                      type="number"
                                      value={item.hargaSatuan}
                                      onChange={(e) => updateHarga(item.id, parseInt(e.target.value) || 0)}
                                      className="w-32"
                                    />
                                  ) : (
                                    `Rp ${item.hargaSatuan.toLocaleString('id-ID')}`
                                  )}
                                </TableCell>
                                <TableCell className="font-medium">
                                  Rp {item.total.toLocaleString('id-ID')}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="font-bold bg-gray-50">
                              <TableCell colSpan={6} className="text-right">Total Nilai:</TableCell>
                              <TableCell className="text-green-600">
                                Rp {selectedSOPb.totalNilai.toLocaleString('id-ID')}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Belum ada barang yang dipesan</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Syarat dan Ketentuan */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Syarat dan Ketentuan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Syarat Pembayaran</Label>
                          <p className="font-medium">{selectedSOPb.syaratPembayaran}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Catatan</Label>
                          <Textarea 
                            placeholder="Tambahkan catatan untuk supplier..."
                            rows={3}
                            disabled={selectedSOPb.status !== 'draft'}
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
                    <p>Pilih SOPb untuk melihat detail</p>
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