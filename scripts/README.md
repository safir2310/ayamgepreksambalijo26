# 📦 Database Export & Seed Scripts

## Overview

Folder ini berisi scripts untuk **backup database lokal** dan **restore ke database baru** (PostgreSQL).

## Scripts

### 1. `export-database.ts`
**Tujuan**: Export semua data dari database lokal (SQLite) ke file JSON dan text yang readable.

**Cara Menjalankan**:
```bash
bun run scripts/export-database.ts
```

**Output Files**:
- `database-export.json` - JSON lengkap semua data
- `database-readable.txt` - Format text yang mudah dibaca

**Data yang Di-export**:
- Users (2 users: Safir, User)
- Products (8 products: Ayam Geprek variants, Nasi Putih, Es Teh, dll)
- Transactions
- Point Products
- Carts

---

### 2. `seed-database.ts`
**Tujuan**: Import data dari `database-export.json` ke database baru (PostgreSQL).

**Cara Menjalankan**:
```bash
# Pastikan database-export.json ada di project root
bun run scripts/seed-database.ts
```

**Fungsi**:
- Import users (password tetap ter-hash)
- Import products
- Import transactions
- Import point products
- Import carts dan cart items

**Catatan**:
- Menggunakan `upsert` jadi tidak akan duplikasi jika data sudah ada
- Data yang sama akan diupdate, data baru akan ditambah

---

## 📊 Data yang Di-export

### Users (2)
1. **Safir** (Admin)
   - Email: musafir2310@gmail.com
   - Phone: 085260812758
   - Points: 0

2. **User** (Regular User)
   - Email: musafir210@gmail.com
   - Phone: 085260812758
   - Points: 0

### Products (8)
1. **Ayam Geprek Sambal Ijo** - Rp 25,000
2. **Ayam Geprek Sambal Merah** - Rp 25,000
3. **Ayam Geprek Original** - Rp 22,000
4. **Nasi Putih** - Rp 5,000
5. **Es Teh Manis** - Rp 5,000
6. **Es Jeruk** - Rp 8,000
7. **Ayam Bakar** - Rp 28,000
8. **Tahu Tempe Goreng** - Rp 5,000

### Transactions (0)
Belum ada data transaksi

### Point Products (0)
Belum ada produk point

### Carts (0)
Belum ada keranjang aktif

---

## 🔄 Workflow Backup & Restore

### Scenario 1: Setup Vercel PostgreSQL

1. **Export** data dari database lokal:
   ```bash
   bun run scripts/export-database.ts
   ```

2. **Setup PostgreSQL** di Vercel:
   - Vercel Dashboard → Storage → Create Database → PostgreSQL
   - Copy connection string
   - Set DATABASE_URL di Environment Variables

3. **Redeploy** aplikasi
   - Vercel otomatis menjalankan `prisma db push`
   - Schema akan ter-create otomatis

4. **Seed data** (opsional):
   - Jika ingin data lama di-import, gunakan `seed-database.ts`
   - Upload `database-export.json` ke project
   - Jalankan: `bun run scripts/seed-database.ts`

### Scenario 2: Reset Database Local

1. **Export** data untuk backup:
   ```bash
   bun run scripts/export-database.ts
   ```
   - Copy `database-export.json` ke tempat aman

2. **Hapus** database lokal:
   ```bash
   rm db/custom.db
   bun run db:push
   ```

3. **Import** data:
   ```bash
   bun run scripts/seed-database.ts
   ```

### Scenario 3: Transfer ke Environment Lain

1. **Export** data:
   ```bash
   bun run scripts/export-database.ts
   ```

2. **Copy** `database-export.json` ke environment baru

3. **Import** data:
   ```bash
   bun run scripts/seed-database.ts
   ```

---

## ⚠️ Penting

### Password Security
- Password di-export dalam format **hashed** (tidak plain text)
- Sangat aman tapi **tidak bisa direcover**
- Setelah import, user harus reset password jika lupa

### Data Integrity
- Export timestamp tersimpan di `database-export.json`
- Gunakan file yang paling baru untuk import
- Jangan edit manual file export JSON

### Database Compatibility
- Export: SQLite (local)
- Import: PostgreSQL (Vercel) atau SQLite (local)
- Schema harus sama di kedua environment

---

## 📋 Checklist untuk Setup Vercel

- [x] Database export script created
- [x] Database seed script created
- [x] Export completed (database-export.json & database-readable.txt)
- [x] Documentation created
- [ ] PostgreSQL database created in Vercel
- [ ] DATABASE_URL set in Vercel Environment Variables
- [ ] NEXTAUTH_SECRET set in Vercel
- [ ] NEXTAUTH_URL set in Vercel
- [ ] SHOP_WHATSAPP_NUMBER set in Vercel
- [ ] Application redeployed after setup
- [ ] Test registration and login

---

## 📁 Files yang Dihasilkan

### Export Files
- `database-export.json` - Full JSON export (3.54 KB)
- `database-readable.txt` - Human-readable text format (643 bytes)

### Script Files
- `scripts/export-database.ts` - Export database to files
- `scripts/seed-database.ts` - Import database from export file
- `scripts/README.md` - This file

---

## 🔍 Export Content (database-readable.txt)

```
=== DATABASE EXPORT ===

Exported At: 2026-02-02T15:06:02.084Z

=== USERS ===

ID: 9483 | Username: Safir | Email: musafir2310@gmail.com | Role: admin
ID: 2832 | Username: User | Email: musafir210@gmail.com | Role: user

=== PRODUCTS ===

Ayam Geprek Sambal Ijo | food | Rp 25,000 | Stock: 50
Ayam Geprek Sambal Merah | food | Rp 25,000 | Stock: 50
Ayam Geprek Original | food | Rp 22,000 | Stock: 50
Nasi Putih | food | Rp 5,000 | Stock: 100
Es Teh Manis | drink | Rp 5,000 | Stock: 100
Es Jeruk | drink | Rp 8,000 | Stock: 80
Ayam Bakar | food | Rp 28,000 | Stock: 40
Tahu Tempe Goreng | food | Rp 5,000 | Stock: 100

=== TRANSACTIONS ===

```

---

## 🚀 Quick Start

### Export Database (Backup):
```bash
bun run scripts/export-database.ts
```

### Import Database (Restore):
```bash
bun run scripts/seed-database.ts
```

---

*Created: 2 February 2026*
