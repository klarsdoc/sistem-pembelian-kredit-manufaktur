// Shared Database untuk Sistem Pembelian Kredit
// Data ini akan digunakan oleh semua modul dan terhubung antar departemen

export interface Supplier {
  id: string
  nama: string
  alamat: string
  telepon: string
  email: string
  kontak: string
  createdAt: string
  updatedAt: string
}

export interface SPPItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantity: number
  satuan: string
  keperluan: string
}

export interface SPP {
  id: string
  nomor: string
  tanggal: string
  dibuatOleh: string
  divisi: string
  items: SPPItem[]
  status: 'draft' | 'submitted' | 'processed'
  tanggalSubmit?: string
  createdAt: string
  updatedAt: string
}

export interface SOPbItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantity: number
  satuan: string
  hargaSatuan: number
  total: number
}

export interface SOPb {
  id: string
  nomor: string
  tanggal: string
  sppId: string
  sppNomor: string
  supplierId: string
  supplier: Supplier
  items: SOPbItem[]
  syaratPembayaran: string
  tanggalKirim: string
  status: 'draft' | 'submitted' | 'sent' | 'received'
  totalNilai: number
  createdAt: string
  updatedAt: string
}

export interface LPBItem {
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

export interface LPB {
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
  createdAt: string
  updatedAt: string
}

export interface KartuGudangItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  satuan: string
  saldoAwal: number
  pemasukan: number
  pengeluaran: number
  saldoAkhir: number
  lokasi: string
  minStock: number
  status: 'cukup' | 'rendah' | 'habis'
  createdAt: string
  updatedAt: string
}

export interface TransaksiGudang {
  id: string
  tanggal: string
  kodeBarang: string
  namaBarang: string
  jenis: 'masuk' | 'keluar'
  quantity: number
  satuan: string
  referensi: string
  keterangan: string
  createdAt: string
}

export interface ThreeWayMatchItem {
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

export interface BKK {
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
  tanggalBayar?: string
  metodePembayaran?: 'transfer' | 'cek' | 'tunai'
  referensiPembayaran?: string
  createdAt: string
  updatedAt: string
}

// Mock Database - Dalam implementasi nyata ini akan diganti dengan database real
export class Database {
  private static instance: Database
  private suppliers: Supplier[] = []
  private spps: SPP[] = []
  private sopbs: SOPb[] = []
  private lpbs: LPB[] = []
  private kartuGudang: KartuGudangItem[] = []
  private transaksiGudang: TransaksiGudang[] = []
  private bkks: BKK[] = []

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  // Supplier methods
  getSuppliers(): Supplier[] {
    return this.suppliers
  }

  addSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
    const newSupplier: Supplier = {
      ...supplier,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.suppliers.push(newSupplier)
    return newSupplier
  }

  // SPP methods
  getSPPs(): SPP[] {
    return this.spps
  }

  addSPP(spp: Omit<SPP, 'id' | 'createdAt' | 'updatedAt'>): SPP {
    const newSPP: SPP = {
      ...spp,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.spps.push(newSPP)
    return newSPP
  }

  updateSPP(id: string, updates: Partial<SPP>): SPP | null {
    const index = this.spps.findIndex(spp => spp.id === id)
    if (index === -1) return null
    
    this.spps[index] = {
      ...this.spps[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.spps[index]
  }

  deleteSPP(id: string): boolean {
    const index = this.spps.findIndex(spp => spp.id === id)
    if (index === -1) return false
    
    this.spps.splice(index, 1)
    return true
  }

  // SOPb methods
  getSOPbs(): SOPb[] {
    return this.sopbs
  }

  addSOPb(sopb: Omit<SOPb, 'id' | 'createdAt' | 'updatedAt'>): SOPb {
    const newSOPb: SOPb = {
      ...sopb,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.sopbs.push(newSOPb)
    return newSOPb
  }

  updateSOPb(id: string, updates: Partial<SOPb>): SOPb | null {
    const index = this.sopbs.findIndex(sopb => sopb.id === id)
    if (index === -1) return null
    
    this.sopbs[index] = {
      ...this.sopbs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.sopbs[index]
  }

  deleteSOPb(id: string): boolean {
    const index = this.sopbs.findIndex(sopb => sopb.id === id)
    if (index === -1) return false
    
    this.sopbs.splice(index, 1)
    return true
  }

  // LPB methods
  getLPBs(): LPB[] {
    return this.lpbs
  }

  addLPB(lpb: Omit<LPB, 'id' | 'createdAt' | 'updatedAt'>): LPB {
    const newLPB: LPB = {
      ...lpb,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.lpbs.push(newLPB)
    return newLPB
  }

  updateLPB(id: string, updates: Partial<LPB>): LPB | null {
    const index = this.lpbs.findIndex(lpb => lpb.id === id)
    if (index === -1) return null
    
    this.lpbs[index] = {
      ...this.lpbs[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.lpbs[index]
  }

  deleteLPB(id: string): boolean {
    const index = this.lpbs.findIndex(lpb => lpb.id === id)
    if (index === -1) return false
    
    this.lpbs.splice(index, 1)
    return true
  }

  // Kartu Gudang methods
  getKartuGudang(): KartuGudangItem[] {
    return this.kartuGudang
  }

  addKartuGudang(item: Omit<KartuGudangItem, 'id' | 'createdAt' | 'updatedAt'>): KartuGudangItem {
    const newItem: KartuGudangItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.kartuGudang.push(newItem)
    return newItem
  }

  updateKartuGudang(id: string, updates: Partial<KartuGudangItem>): KartuGudangItem | null {
    const index = this.kartuGudang.findIndex(item => item.id === id)
    if (index === -1) return null
    
    this.kartuGudang[index] = {
      ...this.kartuGudang[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.kartuGudang[index]
  }

  // Transaksi Gudang methods
  getTransaksiGudang(): TransaksiGudang[] {
    return this.transaksiGudang
  }

  addTransaksiGudang(transaksi: Omit<TransaksiGudang, 'id' | 'createdAt'>): TransaksiGudang {
    const newTransaksi: TransaksiGudang = {
      ...transaksi,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    this.transaksiGudang.unshift(newTransaksi) // Add to beginning for latest first
    return newTransaksi
  }

  // BKK methods
  getBKKs(): BKK[] {
    return this.bkks
  }

  addBKK(bkk: Omit<BKK, 'id' | 'createdAt' | 'updatedAt'>): BKK {
    const newBKK: BKK = {
      ...bkk,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.bkks.push(newBKK)
    return newBKK
  }

  updateBKK(id: string, updates: Partial<BKK>): BKK | null {
    const index = this.bkks.findIndex(bkk => bkk.id === id)
    if (index === -1) return null
    
    this.bkks[index] = {
      ...this.bkks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return this.bkks[index]
  }

  deleteBKK(id: string): boolean {
    const index = this.bkks.findIndex(bkk => bkk.id === id)
    if (index === -1) return false
    
    this.bkks.splice(index, 1)
    return true
  }

  // Initialize with sample data
  initializeData() {
    // Sample suppliers
    this.suppliers = [
      {
        id: '1',
        nama: 'PT. Supplier Maju',
        alamat: 'Jl. Industri No. 123, Jakarta',
        telepon: '021-1234567',
        email: 'info@suppliermaju.com',
        kontak: 'Budi Supplier',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        nama: 'CV. Material Jaya',
        alamat: 'Jl. Pabrik No. 456, Surabaya',
        telepon: '031-987654',
        email: 'order@materialjaya.com',
        kontak: 'Siti Material',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Sample Kartu Gudang
    this.kartuGudang = [
      {
        id: '1',
        kodeBarang: 'BRG001',
        namaBarang: 'Bahan Baku A',
        spesifikasi: 'Grade A',
        satuan: 'Kg',
        saldoAwal: 500,
        pemasukan: 0,
        pengeluaran: 0,
        saldoAkhir: 500,
        lokasi: 'Rak A-1',
        minStock: 100,
        status: 'cukup',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        kodeBarang: 'BRG002',
        namaBarang: 'Bahan Baku B',
        spesifikasi: 'Grade B',
        satuan: 'Kg',
        saldoAwal: 200,
        pemasukan: 0,
        pengeluaran: 0,
        saldoAkhir: 200,
        lokasi: 'Rak B-2',
        minStock: 100,
        status: 'cukup',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
}

// Initialize database
const db = Database.getInstance()
db.initializeData()

export default db