'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  Package, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Eye,
  Warehouse,
  PackageOpen,
  BarChart3
} from 'lucide-react'

// Import database
import db, { KartuGudangItem, TransaksiGudang, LPB } from '@/lib/database'

export default function GudangModule() {
  const [kartuGudang, setKartuGudang] = useState<KartuGudangItem[]>([])
  const [transaksi, setTransaksi] = useState<TransaksiGudang[]>([])
  const [lpbs, setLpbs] = useState<LPB[]>([])
  const [selectedKartu, setSelectedKartu] = useState<KartuGudangItem | null>(null)
  const [isProcessLPBDialogOpen, setIsProcessLPBDialogOpen] = useState(false)
  const [selectedLPB, setSelectedLPB] = useState<LPB | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load data from database
  useEffect(() => {
    setKartuGudang(db.getKartuGudang())
    setTransaksi(db.getTransaksiGudang())
    setLpbs(db.getLPBs())
  }, [])

  const processLPB = () => {
    if (!selectedLPB) return

    selectedLPB.items.forEach((item) => {
      const existingKartu = kartuGudang.find(kg => kg.kodeBarang === item.kodeBarang)
      
      if (existingKartu) {
        const updatedKartu = {
          ...existingKartu,
          pemasukan: existingKartu.pemasukan + item.quantityDiterima,
          saldoAkhir: existingKartu.saldoAkhir + item.quantityDiterima,
          status: existingKartu.saldoAkhir + item.quantityDiterima > existingKartu.minStock ? 'cukup' : 
                  existingKartu.saldoAkhir + item.quantityDiterima === 0 ? 'habis' : 'rendah'
        }
        
        db.updateKartuGudang(existingKartu.id, updatedKartu)
        
        const newTransaksi: TransaksiGudang = {
          id: Date.now().toString(),
          tanggal: new Date().toISOString().split('T')[0],
          kodeBarang: item.kodeBarang,
          namaBarang: item.namaBarang,
          jenis: 'masuk',
          quantity: item.quantityDiterima,
          satuan: item.satuan,
          referensi: selectedLPB.nomor,
          keterangan: `Penerimaan dari LPB ${selectedLPB.nomor}`
        }
        
        db.addTransaksiGudang(newTransaksi)
      } else {
        // Create new kartu gudang if not exists
        const newKartu: KartuGudangItem = {
          id: Date.now().toString(),
          kodeBarang: item.kodeBarang,
          namaBarang: item.namaBarang,
          spesifikasi: item.spesifikasi,
          satuan: item.satuan,
          saldoAwal: 0,
          pemasukan: item.quantityDiterima,
          pengeluaran: 0,
          saldoAkhir: item.quantityDiterima,
          lokasi: 'Rak Baru',
          minStock: 100,
          status: 'cukup'
        }
        
        db.addKartuGudang(newKartu)
        
        const newTransaksi: TransaksiGudang = {
          id: Date.now().toString(),
          tanggal: new Date().toISOString().split('T')[0],
          kodeBarang: item.kodeBarang,
          namaBarang: item.namaBarang,
          jenis: 'masuk',
          quantity: item.quantityDiterima,
          satuan: item.satuan,
          referensi: selectedLPB.nomor,
          keterangan: `Penerimaan dari LPB ${selectedLPB.nomor}`
        }
        
        db.addTransaksiGudang(newTransaksi)
      }
    })

    // Update LPB status
    db.updateLPB(selectedLPB.id, { status: 'submitted' })

    // Refresh data
    setKartuGudang(db.getKartuGudang())
    setTransaksi(db.getTransaksiGudang())
    setLpbs(db.getLPBs())
    
    setIsProcessLPBDialogOpen(false)
    setSelectedLPB(null)
  }

  const updateKartuGudang = (id: string, field: keyof KartuGudangItem, value: any) => {
    const updatedKartu = db.updateKartuGudang(id, { [field]: value })
    if (updatedKartu) {
      setKartuGudang(db.getKartuGudang())
      setSelectedKartu(updatedKartu)
    }
  }

  const deleteKartuGudang = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data kartu gudang ini?')) {
      // Note: In real implementation, you might want to check if there are transactions
      // For now, we'll just remove from the array
      const index = kartuGudang.findIndex(kg => kg.id === id)
      if (index !== -1) {
        kartuGudang.splice(index, 1)
        setKartuGudang([...kartuGudang])
        if (selectedKartu?.id === id) {
          setSelectedKartu(null)
        }
      }
    }
  }

  const getStatusBarang = (status: string) => {
    switch (status) {
      case 'cukup':
        return <Badge className="bg-green-500">Cukup</Badge>
      case 'rendah':
        return <Badge className="bg-yellow-500">Rendah</Badge>
      case 'habis':
        return <Badge className="bg-red-500">Habis</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getJenisTransaksiBadge = (jenis: string) => {
    switch (jenis) {
      case 'masuk':
        return <Badge className="bg-green-500">Masuk</Badge>
      case 'keluar':
        return <Badge className="bg-red-500">Keluar</Badge>
      default:
        return <Badge variant="outline">{jenis}</Badge>
    }
  }

  const filteredKartuGudang = kartuGudang.filter(item =>
    item.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTransaksi = transaksi.filter(trx =>
    trx.kodeBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.referensi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalItem = kartuGudang.length
  const stokCukup = kartuGudang.filter(item => item.status === 'cukup').length
  const stokRendah = kartuGudang.filter(item => item.status === 'rendah').length
  const stokHabis = kartuGudang.filter(item => item.status === 'habis').length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Warehouse className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Modul Gudang</h1>
                <p className="text-gray-600">Kartu Gudang dan Pencatatan Persediaan</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isProcessLPBDialogOpen} onOpenChange={setIsProcessLPBDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <PackageOpen className="h-4 w-4 mr-2" />
                    Proses LPB
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Proses Laporan Penerimaan Barang</DialogTitle>
                    <DialogDescription>
                      Pilih LPB yang akan diproses untuk memperbarui Kartu Gudang
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Pilih LPB</Label>
                      <Select onValueChange={(value) => setSelectedLPB(lpbs.find(lpb => lpb.id === value) || null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih LPB" />
                        </SelectTrigger>
                        <SelectContent>
                          {lpbs.filter(lpb => lpb.status === 'verified').map((lpb) => (
                            <SelectItem key={lpb.id} value={lpb.id}>
                              {lpb.nomor} - {lpb.supplier} ({lpb.items.length} item)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedLPB && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium">Detail LPB:</p>
                        <p className="text-sm text-gray-600">Nomor: {selectedLPB.nomor}</p>
                        <p className="text-sm text-gray-600">Supplier: {selectedLPB.supplier}</p>
                        <p className="text-sm text-gray-600">Tanggal: {selectedLPB.tanggal}</p>
                        <div className="mt-2">
                          <p className="text-sm font-medium">Items:</p>
                          {selectedLPB.items.map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              • {item.kodeBarang} - {item.namaBarang} ({item.quantityDiterima} {item.satuan})
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={processLPB} 
                      className="w-full"
                      disabled={!selectedLPB}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Proses LPB
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan kode barang, nama barang, atau referensi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Item</p>
                  <p className="text-2xl font-bold">{totalItem}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stok Cukup</p>
                  <p className="text-2xl font-bold text-green-600">{stokCukup}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stok Rendah</p>
                  <p className="text-2xl font-bold text-yellow-600">{stokRendah}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stok Habis</p>
                  <p className="text-2xl font-bold text-red-600">{stokHabis}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kartu Gudang */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kartu Gudang</CardTitle>
                <CardDescription>Saldo persediaan per barang</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredKartuGudang.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedKartu?.id === item.id 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedKartu(item)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.kodeBarang}</span>
                        {getStatusBarang(item.status)}
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {item.namaBarang}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          Lokasi: {item.lokasi}
                        </div>
                        <div className="font-medium text-purple-600">
                          {item.saldoAkhir} {item.satuan}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail Kartu Gudang */}
          <div className="lg:col-span-2">
            {selectedKartu ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detail Kartu Gudang</CardTitle>
                  <CardDescription>Informasi lengkap saldo barang</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold mb-3">{selectedKartu.namaBarang}</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Kode Barang:</span>
                          <span className="ml-2 font-medium">{selectedKartu.kodeBarang}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Spesifikasi:</span>
                          <span className="ml-2">{selectedKartu.spesifikasi}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Satuan:</span>
                          <span className="ml-2">{selectedKartu.satuan}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Lokasi:</span>
                          <span className="ml-2">{selectedKartu.lokasi}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2">{getStatusBarang(selectedKartu.status)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Minimum Stock:</span>
                          <span className="ml-2">{selectedKartu.minStock} {selectedKartu.satuan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-3">Ringkasan Pergerakan</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Saldo Awal:</span>
                          <span className="font-medium">{selectedKartu.saldoAwal} {selectedKartu.satuan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Pemasukan:</span>
                          <span className="font-medium text-green-600">+{selectedKartu.pemasukan} {selectedKartu.satuan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-red-600">Pengeluaran:</span>
                          <span className="font-medium text-red-600">-{selectedKartu.pengeluaran} {selectedKartu.satuan}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold">
                          <span>Saldo Akhir:</span>
                          <span className="text-blue-600">{selectedKartu.saldoAkhir} {selectedKartu.satuan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Form */}
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-3">Edit Data</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Lokasi</Label>
                          <Input
                            value={selectedKartu.lokasi}
                            onChange={(e) => updateKartuGudang(selectedKartu.id, 'lokasi', e.target.value)}
                            placeholder="Contoh: Rak A-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Minimum Stock</Label>
                          <Input
                            type="number"
                            value={selectedKartu.minStock}
                            onChange={(e) => updateKartuGudang(selectedKartu.id, 'minStock', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <Button
                          onClick={() => deleteKartuGudang(selectedKartu.id)}
                          variant="destructive"
                          size="sm"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Pilih barang untuk melihat detail</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Transaksi Gudang */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Riwayat Transaksi Gudang</CardTitle>
            <CardDescription>Log pergerakan barang masuk dan keluar</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransaksi.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Kode Barang</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Referensi</TableHead>
                    <TableHead>Keterangan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransaksi.map((trx) => (
                    <TableRow key={trx.id}>
                      <TableCell>{trx.tanggal}</TableCell>
                      <TableCell className="font-medium">{trx.kodeBarang}</TableCell>
                      <TableCell>{trx.namaBarang}</TableCell>
                      <TableCell>{getJenisTransaksiBadge(trx.jenis)}</TableCell>
                      <TableCell className={trx.jenis === 'masuk' ? 'text-green-600' : 'text-red-600'}>
                        {trx.jenis === 'masuk' ? '+' : '-'}{trx.quantity} {trx.satuan}
                      </TableCell>
                      <TableCell>{trx.referensi}</TableCell>
                      <TableCell className="text-sm">{trx.keterangan}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Belum ada transaksi yang tercatat</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}