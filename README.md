# Sistem Pembelian Secara Kredit Perusahaan Manufaktur

## Overview

Aplikasi web berbasis Next.js 15 dengan TypeScript yang mengimplementasikan sistem pembelian kredit untuk perusahaan manufaktur. Aplikasi ini dirancang untuk digunakan oleh semua departemen dalam satu sistem terintegrasi untuk pencatatan transaksi pembelian kredit.

## 🎯 Konsep Utama

Aplikasi ini berfungsi sebagai **sistem pencatatan transaksi** yang menghubungkan semua departemen dengan alur kerja yang sesuai flowchart:

- **Setiap departemen memiliki menu terpisah** dengan prosedur sesuai flowchart
- **Data terhubung antar departemen** (data dari A bisa diakses oleh B)
- **Akses data dibatasi sesuai role** (contoh: Gudang hanya tahu kuantitas, bukan harga)
- **Fitur koreksi data** (edit & delete) untuk memperbaiki kesalahan input

## 🏗️ Struktur Departemen

### 🏭 Produksi/PPIC
- **Prosedur:** Buat SPP, Daftar SPP, Tracking Status
- **Fungsi:** Input permintaan bahan baku
- **Output:** SPP yang dikirim ke Pembelian

### 🛒 Pembelian  
- **Prosedur:** Proses SPP, Buat SOPb, Daftar SOPb, Kiriman ke Supplier
- **Fungsi:** Membuat order berdasarkan SPP dari Produksi
- **Input:** Data SPP dari Produksi
- **Output:** SOPb yang didistribusikan ke semua departemen

### 📦 Penerimaan
- **Prosedur:** Verifikasi Barang, Buat LPB, Daftar LPB, Submit ke Gudang
- **Fungsi:** Verifikasi fisik barang (jenis, mutu, kuantitas)
- **Input:** SOPb dari Pembelian
- **Output:** LPB yang diteruskan ke Gudang

### 🏗️ Gudang
- **Prosedur:** Kartu Gudang, Transaksi, Monitoring Stok
- **Fungsi:** Pencatatan persediaan kuantitas saja
- **Batas Akses:** Hanya melihat kuantitas, tidak ada informasi harga
- **Input:** LPB dari Penerimaan
- **Output:** Data stok yang bisa dilihat Akuntansi

### 🧮 Akuntansi
- **Prosedur:** Three-Way Match, Buat BKK, Daftar BKK, Jurnal Pembelian
- **Fungsi:** Verifikasi SOPb × LPB × Faktur, pencatatan utang
- **Input:** Data dari SOPb, LPB, dan Faktur
- **Output:** BKK yang diserahkan ke Keuangan

### 💰 Keuangan
- **Prosedur:** Otorisasi BKK, Proses Pembayaran, Monitoring Jatuh Tempo
- **Fungsi:** Otorisasi dan pelunasan pembayaran
- **Input:** BKK dari Akuntansi
- **Output:** Pembayaran yang dilakukan

## 🔄 Alur Data Terintegrasi

```
Produksi (SPP) → Pembelian (SOPb) → Supplier → Penerimaan (LPB) → Gudang (Stok) → Akuntansi (BKK) → Keuangan (Bayar)
```

Setiap departemen dapat mengakses data dari departemen sebelumnya yang relevan untuk prosesnya.

## 🛠️ Fitur Utama

### ✅ Dashboard Integrasi
- Overview semua transaksi per departemen
- Real-time status tracking
- Summary statistics (total SPP, SOPb, LPB, BKK)
- Navigation antar departemen

### ✅ Sistem Pencatatan Lengkap
- **Create**: Input data transaksi baru
- **Read**: View data dengan filter dan search
- **Update**: Edit data untuk koreksi kesalahan
- **Delete**: Hapus data yang tidak valid

### ✅ Role-Based Access Control
- **Produksi**: Input SPP
- **Pembelian**: Akses SPP, buat SOPb
- **Penerimaan**: Akses SOPb, buat LPB  
- **Gudang**: Hanya kuantitas, tidak ada harga
- **Akuntansi**: Akses semua data untuk verifikasi
- **Keuangan**: Akses BKK untuk pembayaran

### ✅ Validasi & Kontrol
- Three-Way Match (SOPb × LPB × Faktur)
- Status tracking di setiap tahap
- Required field validation
- Data consistency checks

## 🏗️ Arsitektur Teknis

### Frontend
- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (New York style)
- **Icons**: Lucide React
- **State Management**: React Hooks + Database Class

### Backend
- **API Routes**: Next.js API routes
- **Database**: In-memory Database Class (mock)
- **Data Structure**: TypeScript interfaces
- **Validation**: Client-side dan server-side

### Database Design
```typescript
// Shared interfaces untuk semua departemen
interface SPP { ... }
interface SOPb { ... }  
interface LPB { ... }
interface KartuGudang { ... }
interface BKK { ... }

// Centralized database class
class Database {
  // CRUD operations untuk semua entities
  // Data consistency antar departemen
  // Real-time updates
}
```

## 🚀 Cara Penggunaan

### 1. Akses Sistem
- Buka `http://localhost:3000`
- Gunakan sidebar untuk navigasi departemen
- Pilih prosedur sesuai kebutuhan

### 2. Alur Kerja Standar

#### Step 1: Produksi
1. Pilih departemen "Produksi/PPIC"
2. Klik "Buat SPP Baru"
3. Input barang yang dibutuhkan
4. Submit ke Pembelian

#### Step 2: Pembelian
1. Pilih departemen "Pembelian"
2. Pilih "Proses SPP"
3. Pilih SPP dari Produksi
4. Pilih Supplier
5. Input harga dan buat SOPb
6. Kirim ke Supplier

#### Step 3: Penerimaan
1. Pilih departemen "Penerimaan"
2. Pilih "Verifikasi Barang"
3. Input data fisik barang yang diterima
4. Buat LPB
5. Submit ke Gudang

#### Step 4: Gudang
1. Pilih departemen "Gudang"
2. Pilih "Proses LPB"
3. LPB akan otomatis update stok
4. Monitor saldo di Kartu Gudang

#### Step 5: Akuntansi
1. Pilih departemen "Akuntansi"
2. Pilih "Three-Way Match"
3. Verifikasi SOPb × LPB × Faktur
4. Buat BKK jika match

#### Step 6: Keuangan
1. Pilih departemen "Keuangan"
2. Pilih "Otorisasi BKK"
3. Proses pembayaran
4. Update status menjadi "Lunas"

## 📊 Monitoring & Reporting

### Dashboard Features
- Real-time transaction counts
- Outstanding payment tracking
- Stock level monitoring
- Status per department

### Search & Filter
- Search by document number
- Filter by date range
- Filter by status
- Export data capabilities

## 🔧 Konfigurasi

### Environment Setup
```bash
npm install
npm run dev
```

### Access Points
- Frontend: `http://localhost:3000`
- API Routes: Integrated dengan Next.js

## 🎯 Keunggulan

1. **Terintegrasi**: Data mengalir antar departemen
2. **Role-Based**: Akses data sesuai fungsi departemen
3. **User-Friendly**: Interface intuitif dengan sidebar navigation
4. **Real-time**: Update status langsung
5. **Flexible**: Edit & delete untuk koreksi data
6. **Scalable**: TypeScript dan Next.js architecture
7. **Responsive**: Mobile-friendly design

## 📝 Data Flow Examples

### Data dari Produksi ke Pembelian
```typescript
// Produksi creates SPP
const spp = db.addSPP({...})

// Pembelian can access and process
const submittedSPPs = db.getSPPs().filter(spp => spp.status === 'submitted')
```

### Data dari Penerimaan ke Gudang
```typescript
// Penerimaan creates LPB
const lpb = db.addLPB({...})

// Gudang processes and updates stock
lpb.items.forEach(item => {
  db.updateKartuGudang(item.kodeBarang, { 
    pemasukan: item.quantityDiterima 
  })
})
```

## 🔄 Future Enhancements

- Real database integration (PostgreSQL/MySQL)
- User authentication dan role management
- Email notifications untuk status changes
- Advanced reporting dengan charts
- Export ke PDF/Excel
- Mobile app development
- API untuk integrasi sistem lain

---

**Developed with ❤️ untuk sistem pencatatan transaksi pembelian kredit yang terintegrasi**