import { NextRequest, NextResponse } from 'next/server'

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

// Mock database
let lpbs: LPB[] = [
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
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: lpbs
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newLPB: LPB = {
      id: Date.now().toString(),
      nomor: `LPB-${String(lpbs.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      sopbId: data.sopbId,
      sopbNomor: data.sopbNomor,
      supplier: data.supplier,
      suratJalan: data.suratJalan,
      items: data.items || [],
      diterimaOleh: data.diterimaOleh || 'Penerima Barang',
      status: 'draft',
      totalItemDiterima: data.totalItemDiterima || 0
    }

    lpbs.push(newLPB)

    return NextResponse.json({
      success: true,
      data: newLPB,
      message: 'LPB berhasil dibuat'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Gagal membuat LPB',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}