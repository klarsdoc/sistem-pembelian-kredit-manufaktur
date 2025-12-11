import { NextRequest, NextResponse } from 'next/server'

interface SPPItem {
  id: string
  kodeBarang: string
  namaBarang: string
  spesifikasi: string
  quantity: number
  satuan: string
  keperluan: string
}

interface SPP {
  id: string
  nomor: string
  tanggal: string
  dibuatOleh: string
  divisi: string
  items: SPPItem[]
  status: 'draft' | 'submitted' | 'processed'
  tanggalSubmit?: string
}

// Mock database
let spps: SPP[] = [
  {
    id: '1',
    nomor: 'SPP-001/2025',
    tanggal: '2025-06-17',
    dibuatOleh: 'Budi Santoso',
    divisi: 'Produksi',
    status: 'draft',
    items: []
  }
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: spps
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const newSPP: SPP = {
      id: Date.now().toString(),
      nomor: `SPP-${String(spps.length + 1).padStart(3, '0')}/2025`,
      tanggal: new Date().toISOString().split('T')[0],
      dibuatOleh: data.dibuatOleh || 'User Produksi',
      divisi: data.divisi || 'Produksi',
      status: 'draft',
      items: []
    }

    spps.push(newSPP)

    return NextResponse.json({
      success: true,
      data: newSPP,
      message: 'SPP berhasil dibuat'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Gagal membuat SPP',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}