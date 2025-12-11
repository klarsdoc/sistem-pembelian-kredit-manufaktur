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
  Factory,
  Calendar,
  User,
  Package,
  CheckCircle
} from 'lucide-react'

// Import database
import db, { SPP, SPPItem } from '@/lib/database'

export default function ProduksiModule() {
  const [spps, setSpps] = useState<SPP[]>([])
  const [selectedSPP, setSelectedSPP] = useState<SPP | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<SPPItem>>({
    kodeBarang: '',
    namaBarang: '',
    spesifikasi: '',
    quantity: 0,
    satuan: '',
    keperluan: ''
  })

  // Load data from database
  useEffect(() => {
    setSpps(db.getSPPs())
  }, [])

  const createSPP = () => {
    const newSPP = db.addSPP({
      nomor: `SPP-${String(spps.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      dibuatOleh: 'User Produksi',
      divisi: 'Produksi',
      status: 'draft',
      items: []
    })

    setSpps(db.getSPPs())
    setSelectedSPP(newSPP)
    setIsCreateDialogOpen(false)
  }

  const addItemToSPP = () => {
    if (!selectedSPP || !newItem.kodeBarang || !newItem.namaBarang || !newItem.quantity) return

    const item: SPPItem = {
      id: Date.now().toString(),
      kodeBarang: newItem.kodeBarang || '',
      namaBarang: newItem.namaBarang || '',
      spesifikasi: newItem.spesifikasi || '',
      quantity: newItem.quantity || 0,
      satuan: newItem.satuan || 'Unit',
      keperluan: newItem.keperluan || ''
    }

    const updatedSPP = {
      ...selectedSPP,
      items: [...selectedSPP.items, item]
    }

    db.updateSPP(selectedSPP.id, updatedSPP)
    setSpps(db.getSPPs())
    setSelectedSPP(updatedSPP)
    
    // Reset form
    setNewItem({
      kodeBarang: '',
      namaBarang: '',
      spesifikasi: '',
      quantity: 0,
      satuan: '',
      keperluan: ''
    })
  }

  const updateSPP = (updatedSPP: SPP) => {
    db.updateSPP(updatedSPP.id, updatedSPP)
    setSpps(db.getSPPs())
    setSelectedSPP(updatedSPP)
    setIsEditDialogOpen(false)
  }

  const deleteSPP = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus SPP ini?')) {
      db.deleteSPP(id)
      setSpps(db.getSPPs())
      if (selectedSPP?.id === id) {
        setSelectedSPP(null)
      }
    }
  }

  const deleteItem = (itemId: string) => {
    if (!selectedSPP) return
    
    const updatedSPP = {
      ...selectedSPP,
      items: selectedSPP.items.filter(item => item.id !== itemId)
    }

    db.updateSPP(selectedSPP.id, updatedSPP)
    setSpps(db.getSPPs())
    setSelectedSPP(updatedSPP)
  }

  const submitSPP = () => {
    if (!selectedSPP || selectedSPP.items.length === 0) return

    const updatedSPP = {
      ...selectedSPP,
      status: 'submitted' as const,
      tanggalSubmit: new Date().toISOString().split('T')[0]
    }

    db.updateSPP(selectedSPP.id, updatedSPP)
    setSpps(db.getSPPs())
    setSelectedSPP(updatedSPP)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'submitted':
        return <Badge className="bg-blue-500">Terkirim</Badge>
      case 'processed':
        return <Badge className="bg-green-500">Diproses</Badge>
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
              <Factory className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Produksi/PPIC</h1>
                <p className="text-gray-600">Surat Permintaan Pembelian (SPP)</p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat SPP Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Buat Surat Permintaan Pembelian Baru</DialogTitle>
                  <DialogDescription>
                    Membuat SPP baru untuk permintaan bahan baku atau barang lainnya
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Button onClick={createSPP} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Buat SPP
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar SPP */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daftar SPP</CardTitle>
                <CardDescription>Surat Permintaan Pembelian yang telah dibuat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {spps.map((spp) => (
                    <div
                      key={spp.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSPP?.id === spp.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSPP(spp)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{spp.nomor}</span>
                        {getStatusBadge(spp.status)}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {spp.tanggal}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {spp.dibuatOleh}
                        </div>
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {spp.items.length} item
                        </div>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {spp.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedSPP(spp)
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
                            deleteSPP(spp.id)
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

          {/* Detail SPP */}
          <div className="lg:col-span-2">
            {selectedSPP ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedSPP.nomor}</CardTitle>
                      <CardDescription>
                        Detail Surat Permintaan Pembelian
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(selectedSPP.status)}
                      {selectedSPP.status === 'draft' && (
                        <Button 
                          onClick={submitSPP}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={selectedSPP.items.length === 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Kirim ke Pembelian
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informasi SPP */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Nomor SPP</Label>
                      <p className="font-medium">{selectedSPP.nomor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Tanggal</Label>
                      <p className="font-medium">{selectedSPP.tanggal}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Dibuat Oleh</Label>
                      <p className="font-medium">{selectedSPP.dibuatOleh}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Divisi</Label>
                      <p className="font-medium">{selectedSPP.divisi}</p>
                    </div>
                    {selectedSPP.tanggalSubmit && (
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-600">Tanggal Submit</Label>
                        <p className="font-medium">{selectedSPP.tanggalSubmit}</p>
                      </div>
                    )}
                  </div>

                  {/* Form Tambah Item */}
                  {selectedSPP.status === 'draft' && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tambah Item Baru</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="kodeBarang">Kode Barang</Label>
                            <Input
                              id="kodeBarang"
                              value={newItem.kodeBarang}
                              onChange={(e) => setNewItem({...newItem, kodeBarang: e.target.value})}
                              placeholder="Contoh: BRG001"
                            />
                          </div>
                          <div>
                            <Label htmlFor="namaBarang">Nama Barang</Label>
                            <Input
                              id="namaBarang"
                              value={newItem.namaBarang}
                              onChange={(e) => setNewItem({...newItem, namaBarang: e.target.value})}
                              placeholder="Contoh: Bahan Baku A"
                            />
                          </div>
                          <div>
                            <Label htmlFor="spesifikasi">Spesifikasi</Label>
                            <Input
                              id="spesifikasi"
                              value={newItem.spesifikasi}
                              onChange={(e) => setNewItem({...newItem, spesifikasi: e.target.value})}
                              placeholder="Contoh: Grade A, 100kg"
                            />
                          </div>
                          <div>
                            <Label htmlFor="satuan">Satuan</Label>
                            <Select value={newItem.satuan} onValueChange={(value) => setNewItem({...newItem, satuan: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih satuan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Unit">Unit</SelectItem>
                                <SelectItem value="Kg">Kg</SelectItem>
                                <SelectItem value="Liter">Liter</SelectItem>
                                <SelectItem value="Meter">Meter</SelectItem>
                                <SelectItem value="Box">Box</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={newItem.quantity}
                              onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="keperluan">Keperluan</Label>
                            <Textarea
                              id="keperluan"
                              value={newItem.keperluan}
                              onChange={(e) => setNewItem({...newItem, keperluan: e.target.value})}
                              placeholder="Jelaskan keperluan barang ini"
                              rows={2}
                            />
                          </div>
                        </div>
                        <Button onClick={addItemToSPP} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Item
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Daftar Item */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Daftar Barang Diminta</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSPP.items.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Kode</TableHead>
                              <TableHead>Nama Barang</TableHead>
                              <TableHead>Spesifikasi</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Satuan</TableHead>
                              <TableHead>Keperluan</TableHead>
                              {selectedSPP.status === 'draft' && <TableHead>Aksi</TableHead>}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {selectedSPP.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.kodeBarang}</TableCell>
                                <TableCell>{item.namaBarang}</TableCell>
                                <TableCell className="text-sm">{item.spesifikasi}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.satuan}</TableCell>
                                <TableCell className="text-sm">{item.keperluan}</TableCell>
                                {selectedSPP.status === 'draft' && (
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => deleteItem(item.id)}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Belum ada barang yang ditambahkan</p>
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
                    <p>Pilih SPP untuk melihat detail</p>
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