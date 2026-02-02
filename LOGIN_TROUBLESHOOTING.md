# 🔍 Login Troubleshooting Guide

## ⚠️ Masalah: Login Gagal

Jika login menampilkan error "Terjadi kesalahan saat login", ikuti panduan ini untuk troubleshooting.

---

## 🎯 Kemungkinan Penyebab Login Gagal

### 1. Environment Variables Belum Di-set di Vercel

**Symptoms:**
- Error: "Database tidak dapat terhubung"
- Status code: 503
- Atau error umum "Terjadi kesalahan saat login"

**Solusi:**
1. Buka Vercel Dashboard → Settings → Environment Variables
2. Pastikan ke-4 variable sudah di-set:
   - ✅ `DATABASE_URL`
   - ✅ `NEXTAUTH_URL`
   - ✅ `NEXTAUTH_SECRET`
   - ✅ `SHOP_WHATSAPP_NUMBER`
3. Pastikan semua checklist: Production, Preview, Development
4. Redeploy aplikasi (Deployments → latest → Redeploy)

---

### 2. Database PostgreSQL Belum Dibuat

**Symptoms:**
- Error: "Data tidak ditemukan"
- Atau error koneksi database
- User yang baru diregistrasi tidak bisa login

**Solusi:**
1. Vercel Dashboard → Storage
2. Klik **Create Database** → **PostgreSQL**
3. Copy connection string
4. Set sebagai `DATABASE_URL` di Environment Variables
5. Redeploy

---

### 3. Username atau Password Salah

**Symptoms:**
- Error: "Username atau password salah"
- Status code: 401
- User sudah diregistrasi tapi tidak bisa login

**Solusi:**
1. Cek username yang diinput:
   - Pastikan sesuai dengan saat registrasi
   - Cek huruf besar/kecil (sensitive!)
   - Pastikan tidak ada spasi ekstra

2. Cek password:
   - Pastikan sesuai dengan saat registrasi
   - Cek Caps Lock keyboard
   - Reset password jika lupa

3. Cek apakah user sudah terdaftar:
   - Coba register lagi dengan username yang sama
   - Jika error "Username sudah digunakan", berarti user ada
   - Coba login dengan password yang benar

---

### 4. User Belum Terdaftar

**Symptoms:**
- Error: "Username atau password salah"
- Tapi user belum pernah diregistrasi

**Solusi:**
1. Register akun baru terlebih dahulu
2. Gunakan email, username, phone yang berbeda
3. Setelah berhasil registrasi, coba login

---

## 🔍 Cara Cek Error Detail

### Method 1: Browser Console

1. Buka aplikasi di browser
2. Tekan **F12** untuk buka Developer Tools
3. Klik tab **Console**
4. Coba login
5. Lihat error message yang tampil di console

**Contoh Console Log:**
```
Login attempt with username: Safir
Login response: { error: "Database tidak dapat terhubung" }
```

### Method 2: Vercel Function Logs

1. Buka Vercel Dashboard
2. Pilih project: `safir2310s-projects/my-project`
3. Klik **Deployments**
4. Klik deployment terbaru
5. Klik tab **Functions** atau **Function Logs**
6. Cari function `/api/auth/login`
7. Lihat log error

**Contoh Log Error:**
```
❌ Database connection failed: Connection refused
```
 atau
```
❌ Login error: { message: "Connection timeout", code: "P1001" }
```

### Method 3: Network Tab

1. Browser: Tekan F12
2. Klik tab **Network**
3. Filter: login (atau klik request `/api/auth/login`)
4. Lihat response:
   - Status code (200 = success, 4xx/5xx = error)
   - Response body
   - Time taken

**Contoh Response:**
```json
Status: 500
Response: { error: "Database tidak dapat terhubung" }
```

---

## 🛠️ Step-by-Step Fix

### Step 1: Cek Environment Variables (Wajib!)

**Di Vercel Dashboard:**
1. Settings → Environment Variables
2. Pastikan ke-4 variable ada:

| Variable | Must Be Present | Correct Value |
|----------|-----------------|----------------|
| `DATABASE_URL` | ✅ | Connection string dari Vercel PostgreSQL |
| `NEXTAUTH_URL` | ✅ | `https://my-project-98sc9bdeo-safir2310s-projects.vercel.app` |
| `NEXTAUTH_SECRET` | ✅ | Random string 32+ chars |
| `SHOP_WHATSAPP_NUMBER` | ✅ | Nomor WhatsApp Anda |

3. Checklist semua: Production, Preview, Development

### Step 2: Redeploy Aplikasi

**Di Vercel Dashboard:**
1. Deployments → Klik latest → Redeploy
2. Tunggu 1-2 menit

### Step 3: Test dengan User Baru

**Jika environment variables baru di-set:**
1. Register akun baru:
   - Username: `testbaru`
   - Email: `testbaru@example.com`
   - Password: `password123`
2. Coba login dengan akun baru
3. Jika berhasil → Masalah teratasi! ✅

### Step 4: Jika Masih Gagal

**Cek logs:**
1. Browser Console (F12)
2. Vercel Function Logs
3. Network tab

**Identify error:**
- "Database tidak dapat terhubung" → Problem dengan DATABASE_URL
- "Data tidak ditemukan" → User belum terdaftar
- "Username atau password salah" → Credentials salah
- Error code lain → Cek dokumentasi Prisma

---

## 📊 Common Error Codes

| Error Code | Description | Solution |
|-------------|-------------|-----------|
| P1001 | Database connection failed | Cek DATABASE_URL di Vercel |
| P2025 | Record not found | Cek username/password, atau register user baru |
| P2002 | Unique constraint violation | Username/email sudah ada |
| 503 | Service unavailable | Database tidak ready, coba lagi nanti |

---

## 🧪 Test Connection

### Test 1: Test Registration Dulu

Sebelum login, pastikan registrasi berjalan:

1. Register akun baru
2. Jika registrasi berhasil → Database sudah terhubung
3. Coba login dengan akun yang baru diregistrasi

### Test 2: Test dengan Local Development

Untuk isolasi masalah:

1. Jalankan local: `bun run dev`
2. Register akun baru
3. Coba login
4. Jika local works tapi Vercel fails → Problem dengan environment variables

---

## ✅ Checklist

Sebelum lanjut, pastikan:

- [ ] Environment variables di-set di Vercel
- [ ] DATABASE_URL valid (connection string dari Vercel Storage)
- [ ] NEXTAUTH_URL valid (production URL)
- [ ] NEXTAUTH_SECRET valid (32+ chars random string)
- [ ] SHOP_WHATSAPP_NUMBER valid (nomor WhatsApp)
- [ ] Aplikasi sudah di-redeploy setelah setup variables
- [ ] Registrasi sudah berhasil tested
- [ ] Login tested dengan user yang baru diregistrasi

---

## 💡 Tips

### 1. Username/Password Case-Sensitive
- ✅ Username: `Safir` ≠ `safir`
- ✅ Password: `Password123` ≠ `password123`

### 2. Copy-Paste Values
- ✅ Saat setup environment variables, copy-paste connection string
- ❌ Jangan ketik manual (bisa ada typo)

### 3. Redeploy Wajib
- ✅ Selalu redeploy setelah change environment variables
- ✅ Build akan menggunakan environment baru

### 4. Check Logs
- ✅ Browser Console → Frontend errors
- ✅ Vercel Function Logs → Backend errors
- ✅ Network Tab → Response details

---

## 🎯 Quick Fix Summary

**Login gagal? Cek urutan ini:**

1. **Environment Variables Set?** → Jika tidak, setup di Vercel
2. **Database Connected?** → Jika tidak, cek DATABASE_URL
3. **User Registered?** → Jika tidak, register dulu
4. **Password Correct?** → Jika tidak, cek Caps Lock, atau reset
5. **Redeployed?** → Jika tidak, redeploy dari Vercel Dashboard

---

## 📞 Bantuan Lanjutan

Jika masih tidak bisa login setelah cek semua:

1. **Buka Vercel Dashboard** → Deployments → latest → Logs
2. **Copy error message** yang tampil
3. **Buka DEPLOYMENT_INSTRUCTIONS.md** untuk panduan setup
4. **Buka VERCEL_DATABASE_SETUP.md** untuk panduan database

---

*Last Updated: 31 January 2025*
*Status: Login error handling improved with detailed logging*
