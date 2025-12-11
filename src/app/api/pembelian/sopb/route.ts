import { NextRequest, NextResponse } from 'next/server'

interface Supplier {
  id: string
  nama: string
  alamat: string
  telepon: string
  email: string
  kontak: string
}

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
  sppId: string
  sppNomor: string
  supplierId: string
  supplier: Supplier
  items: SOPbItem[]
  syaratPembayaran: string
  tanggalKirim: string
  status: 'draft' | 'submitted' | 'sent' | 'received'
  totalNilai: number
}

// Mock database
let sopbs: SOPb[] = [
  {
    id: '1',
    nomor: 'SOPb-001/2025',
    tanggal: '2025-06-17',
    sppId: '1',
    sppNomor: 'SPP-001/2025',
    supplierId: '1',
    supplier: {
      id: '1',
      nama: 'PT. Supplier Maju',
      alamat: 'Jl. Industri No. 123, Jakarta',
      telepon: '021-1234567',
      email: 'info@suppliermaju.com',
      kontak: 'Budi Supplier'
    },
    items: [],
    syaratPembayaran: 'Net 30',
    tanggalKirim: '2025-06-25',
    status: 'draft',
    totalNilai: 0
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: sopbs
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newSOPb: SOPb = {
      id: Date.now().toString(),
      nomor: `SOPb-${String(sopbs.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      sppId: data.sppId,
      sppNomor: data.sppNomor,
      supplierId: data.supplierId,
      supplier: data.supplier,
      items: data.items || [],
      syaratPembayaran: data.syaratPembayaran || 'Net 30',
      tanggalKirim: data.tanggalKirim || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      totalNilai: data.totalNilai || 0
    }

    sopbs.push(newSOPb)

    return NextResponse.json({
      success: true,
      data: newSOPb,
      message: 'SOPb berhasil dibuat'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Gagal membuat SOPb',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}