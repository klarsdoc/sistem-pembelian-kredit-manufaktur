'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Factory, 
  ShoppingCart, 
  PackageCheck, 
  Warehouse, 
  Calculator, 
  DollarSign,
  FileText,
  Home,
  Menu,
  X
} from 'lucide-react'

interface Department {
  id: string
  name: string
  description: string
  icon: any
  color: string
  procedures: string[]
}

const departments: Department[] = [
  {
    id: 'produksi',
    name: 'Produksi/PPIC',
    description: 'Permintaan Pembelian',
    icon: Factory,
    color: 'bg-blue-500',
    procedures: ['Buat SPP', 'Daftar SPP', 'Tracking Status']
  },
  {
    id: 'pembelian',
    name: 'Pembelian',
    description: 'Order Pembelian',
    icon: ShoppingCart,
    color: 'bg-green-500',
    procedures: ['Proses SPP', 'Buat SOPb', 'Daftar SOPb', 'Kiriman ke Supplier']
  },
  {
    id: 'penerimaan',
    name: 'Penerimaan',
    description: 'Penerimaan Barang',
    icon: PackageCheck,
    color: 'bg-orange-500',
    procedures: ['Verifikasi Barang', 'Buat LPB', 'Daftar LPB', 'Submit ke Gudang']
  },
  {
    id: 'gudang',
    name: 'Gudang',
    description: 'Persediaan',
    icon: Warehouse,
    color: 'bg-purple-500',
    procedures: ['Kartu Gudang', 'Transaksi', 'Monitoring Stok']
  },
  {
    id: 'akuntansi',
    name: 'Akuntansi',
    description: 'Verifikasi & Utang',
    icon: Calculator,
    color: 'bg-red-500',
    procedures: ['Three-Way Match', 'Buat BKK', 'Daftar BKK', 'Jurnal Pembelian']
  },
  {
    id: 'keuangan',
    name: 'Keuangan',
    description: 'Pembayaran',
    icon: DollarSign,
    color: 'bg-yellow-500',
    procedures: ['Otorisasi BKK', 'Proses Pembayaran', 'Monitoring Jatuh Tempo', 'Laporan Pembayaran']
  }
]

interface SidebarProps {
  selectedDepartment: string | null
  selectedProcedure: string | null
  onDepartmentSelect: (dept: string | null) => void
  onProcedureSelect: (procedure: string | null) => void
}

export default function Sidebar({ 
  selectedDepartment, 
  selectedProcedure, 
  onDepartmentSelect, 
  onProcedureSelect 
}: SidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const currentDept = departments.find(d => d.id === selectedDepartment)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Sistem Pembelian</h1>
                <p className="text-xs text-gray-500">Kredit Manufaktur</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {/* Dashboard */}
            <Button
              variant={selectedDepartment === null ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onDepartmentSelect(null)
                onProcedureSelect(null)
                setIsMobileMenuOpen(false)
              }}
            >
              <Home className="h-4 w-4 mr-3" />
              Dashboard
            </Button>

            {/* Departments */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Departemen
              </p>
              {departments.map((dept) => {
                const Icon = dept.icon
                return (
                  <Button
                    key={dept.id}
                    variant={selectedDepartment === dept.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onDepartmentSelect(dept.id)
                      onProcedureSelect(null)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-xs text-gray-500">{dept.description}</div>
                    </div>
                  </Button>
                )
              })}
            </div>

            {/* Procedures */}
            {currentDept && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  Prosedur {currentDept.name}
                </p>
                {currentDept.procedures.map((procedure) => (
                  <Button
                    key={procedure}
                    variant={selectedProcedure === procedure ? "default" : "ghost"}
                    className="w-full justify-start pl-12"
                    onClick={() => {
                      onProcedureSelect(procedure)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {procedure}
                  </Button>
                ))}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Sistem Pencatatan Transaksi<br />
              Pembelian Kredit v1.0
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}