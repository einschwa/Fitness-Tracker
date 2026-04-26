# ForgeFit Tracker Documentation

## Ringkasan
ForgeFit Tracker adalah website pelacak latihan mingguan yang menyediakan login sederhana, form logging latihan, ringkasan analitik, dan grafik tren beban latihan berbasis Firebase Realtime Database.

## Fitur Utama
- Login sederhana berbasis nama + password (Sign In / Register)
- Logging latihan harian berdasarkan kategori (PULL, PUSH, LEG + CORE)
- Detail latihan: beban, set, repetisi, catatan
- Ringkasan mingguan: sesi, total volume, total set, kategori teratas
- Tabel rekam mingguan dengan tooltip detail
- Grafik tren load 30 hari / 12 bulan (Chart.js)

## Teknologi
- HTML + Tailwind CSS (CDN)
- JavaScript (ES Modules)
- Firebase Realtime Database (SDK v10)
- Chart.js (CDN)

## Struktur Halaman
- index.html
  - Redirect otomatis ke login.html.
- login.html
  - Form login / register dan pengelolaan mode autentikasi.
- app.html
  - Dashboard utama: ringkasan, grafik, form logging, tabel mingguan.

## Struktur File
- app.js
  - Logika utama UI, autentikasi sederhana, CRUD ke Firebase, analitik, dan chart.
- firebase-config.js
  - Konfigurasi Firebase (window.firebaseConfig).
- styles.css
  - Styling tambahan dan efek tooltip.
- assets/
  - Gambar latihan per kategori.

## Mekanisme Aplikasi
### 1) Autentikasi Sederhana
- Sign In dan Register berjalan di login.html.
- Data user disimpan di Firebase pada path:
  - login/allowedUsers/{userKey}
- userKey dibentuk dari nama (lowercase, spasi jadi dash, karakter khusus diganti underscore).
- Setelah login sukses, nama user disimpan di sessionStorage dengan key ff_user.
- app.html memeriksa ff_user; jika kosong, redirect ke login.html.

### 2) Logging Latihan
- User memilih kategori dan exercise.
- Form mengirim payload ke Firebase pada path:
  - workouts/{userKey}/{dateKey}/{category}/records
- dateKey format: YYYY-MM-DD.
- Payload mencakup:
  - userName, category, exerciseName, cues, muscleFocus, weightKg, sets, reps, notes, createdAt.

### 3) Rekap Mingguan
- Data mingguan dihitung dari data pada minggu aktif.
- Tabel menampilkan hari, tanggal, dan badge kategori yang sudah terisi.
- Tooltip memuat detail exercise per hari.

### 4) Analitik
- Total sesi dihitung per hari yang memiliki records.
- Total volume dihitung dengan rumus:
  - volume = sets * reps * weightKg
- Total set adalah akumulasi semua record.
- Kategori teratas diambil dari kategori dengan jumlah sesi terbanyak.

### 5) Grafik Tren Load
- Menggunakan Chart.js.
- Dua mode range:
  - 30 hari terakhir
  - 12 bulan terakhir
- Bisa filter per kategori atau semua kategori.

## Struktur Data Firebase (Contoh)
```
login
  allowedUsers
    alex
      name: "Alex"
      password: "123456"
      createdAt: "2026-04-26T12:00:00.000Z"
workouts
  alex
    2026-04-26
      PULL
        records
          -Kx...
            userName: "Alex"
            category: "PULL"
            exerciseName: "Conventional Deadlift"
            cues: "..."
            muscleFocus: "Back, Biceps, Rear Delts, Hamstrings"
            weightKg: 60
            sets: 4
            reps: 8
            notes: "Felt strong"
            createdAt: "2026-04-26T12:05:00.000Z"
```

## Cara Menjalankan (Lokal)
1. Pastikan koneksi internet aktif (menggunakan CDN dan Firebase).
2. Buka index.html atau login.html langsung di browser.
3. Register user baru, lalu Sign In.

## Konfigurasi Firebase
- File firebase-config.js berisi kredensial Firebase.
- Pastikan Realtime Database sudah aktif.
- Atur rules sesuai kebutuhan (contoh sederhana di bawah).

### Contoh Rules (Sederhana)
> Gunakan sesuai kebutuhan keamanan.
```
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## Catatan Keamanan
- Autentikasi saat ini masih sederhana (password disimpan plain text di database).
- Untuk produksi, disarankan:
  - Menggunakan Firebase Authentication.
  - Menyimpan password dengan hash.
  - Menambahkan rules yang lebih ketat per user.

## Alur Halaman
- index.html -> login.html
- login.html -> app.html (setelah login)
- app.html -> login.html (logout)
