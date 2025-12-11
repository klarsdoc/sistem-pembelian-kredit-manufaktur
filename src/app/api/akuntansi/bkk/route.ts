import { NextRequest, NextResponse } from 'next/server'

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

// Mock database
let bkks: BKK[] = [
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
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: bkks
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newBKK: BKK = {
      id: Date.now().toString(),
      nomor: `BKK-${String(bkks.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      fakturNomor: data.fakturNomor,
      supplier: data.supplier,
      items: data.items || [],
      totalNilai: data.totalNilai || 0,
      syaratPembayaran: data.syaratPembayaran || 'Net 30',
      tanggalJatuhTempo: data.tanggalJatuhTempo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: data.status || 'verified',
      dibuatOleh: data.dibuatOleh || 'Akuntan'
    }

    bkks.push(newBKK)

    return NextResponse.json({
      success: true,
      data: newBKK,
      message: 'BKK berhasil dibuat'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Gagal membuat BKK',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}