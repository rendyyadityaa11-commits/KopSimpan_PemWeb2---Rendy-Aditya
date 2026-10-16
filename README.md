# KopSimpan Admin Panel

Proyek front-end sistem informasi koperasi simpan pinjam untuk tugas Pemrograman Web 2. Proyek ini mengikuti arah desain dari Stitch AI yang dilampirkan, dengan gaya Material Design, warna hijau finansial, aksen kuning, kartu ringkasan, grafik, tabel, dan komponen responsif.

## Fitur yang sudah tersedia

- Halaman login demo untuk admin dan anggota.
- Dashboard anggota dengan ringkasan simpanan, pinjaman, dan aktivitas transaksi.
- Dashboard dengan kartu ringkasan, grafik arus kas, distribusi portofolio, dan transaksi yang menunggu verifikasi.
- Data master anggota dengan pencarian, filter status, detail, tambah, edit, dan hapus.
- Form anggota dengan validasi nama, NIK, nomor HP, email, dan pemeriksaan NIK duplikat.
- Pencatatan transaksi setoran dan angsuran melalui modal.
- Verifikasi transaksi dan pembaruan status transaksi.
- Daftar pinjaman dengan detail serta simulasi persetujuan atau penolakan.
- Status pengajuan layanan dengan pembaruan status.
- Laporan transaksi dengan filter periode, ekspor CSV, grafik, dan cetak ke PDF melalui dialog cetak browser.
- Mode gelap, sidebar responsif, notifikasi, modal konfirmasi, dan toast.
- Data contoh tersimpan di `localStorage` browser. Tidak memerlukan server atau database.

## Teknologi

- HTML5 semantik
- CSS3, Flexbox, Grid, dan media queries
- JavaScript ES6 untuk manipulasi DOM, validasi, modal, filter, dan penyimpanan data lokal
- Chart.js 4 untuk visualisasi grafik
- Google Fonts Inter dan Material Symbols

## Akun demo

- Email: `admin@kopsimpan.id`
- Kata sandi: `admin123`
- Untuk dashboard anggota, pilih tab **Anggota / Nasabah**. Form akan mengisi akun demo anggota secara otomatis.

Akun ini hanya untuk demonstrasi. Jangan memasukkan data pribadi atau data keuangan nyata.

## Menjalankan proyek

Cara yang disarankan adalah menggunakan server lokal sederhana, misalnya ekstensi **Live Server** di Visual Studio Code.

1. Ekstrak ZIP proyek.
2. Buka folder `kopsimpan-admin-panel` di Visual Studio Code.
3. Jalankan `index.html` dengan Live Server.
4. Masuk menggunakan akun demo di atas.
5. Jelajahi menu di sidebar.

Proyek juga bisa dibuka langsung melalui `index.html`, tetapi server lokal lebih disarankan agar perilaku navigasi dan penyimpanan browser lebih konsisten. Font, ikon, dan Chart.js memerlukan koneksi internet karena menggunakan CDN.

## Struktur folder

```text
kopsimpan-admin-panel/
├── index.html
├── PERANCANGAN.md
├── README.md
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── docs/
│   └── screenshots/
│       ├── stitch-dashboard-admin.png
│       ├── stitch-dashboard-anggota.png
│       ├── stitch-login.png
│       ├── stitch-modal-setoran.png
│       ├── stitch-status-transaksi.png
│       └── stitch-style-guide.png
└── pages/
    ├── dashboard.html
    ├── dashboard-anggota.html
    ├── anggota.html
    ├── form-anggota.html
    ├── transaksi.html
    ├── pinjaman.html
    ├── pengajuan.html
    └── laporan.html
```

## Publikasi GitHub Pages atau Vercel

### GitHub Pages

1. Buat repository GitHub baru.
2. Unggah seluruh isi folder proyek ke root repository.
3. Buka **Settings > Pages**.
4. Pilih branch utama dan folder root, lalu simpan.
5. Tunggu sampai GitHub Pages menampilkan URL publik.

### Vercel

1. Unggah proyek ke GitHub.
2. Masuk ke Vercel dan pilih **Add New Project**.
3. Impor repository tersebut.
4. Gunakan pengaturan default untuk situs statis, tanpa build command dan tanpa output directory khusus.
5. Deploy dan salin URL publik.

## Fitur tambahan dashboard anggota

Dashboard anggota kini menyediakan tombol **Ajukan Pinjaman**, kartu Sisa Pinjaman dan Jatuh Tempo yang dapat dibuka, rincian riwayat angsuran, serta simulasi pembayaran melalui Transfer Bank atau Saldo Simpanan. Pengajuan disimpan dengan status `Menunggu Persetujuan`. Pembayaran simulasi memperbarui sisa pinjaman, jumlah angsuran, tanggal jatuh tempo, riwayat pembayaran, dan aktivitas transaksi di `localStorage`. Modal menggunakan gaya glassmorphism gelap yang mengikuti tema KopSimpan.

Untuk melihat implementasinya, buka `renderMemberDashboard()` dan helper modal/pembayaran pada `assets/js/app.js`. Gaya tambahan berada di bagian paling bawah `assets/css/style.css`.

## Catatan batasan prototipe

Proyek ini memenuhi fokus client-side. Data disimpan di browser masing-masing melalui `localStorage`, sehingga tidak tersinkron antarperangkat atau antar pengguna. Login hanya simulasi antarmuka, bukan autentikasi yang aman. Untuk penggunaan nyata, proyek membutuhkan backend, database, otorisasi, dan pengamanan data.


## Fitur tambahan role Admin dan Anggota

- `login.html`: halaman masuk dengan pemeriksaan akun dan peran dari `localStorage`.
- `admin-dashboard.html`: alias dashboard admin yang mempertahankan halaman dashboard lama.
- `member-dashboard.html`: alias dashboard anggota yang mempertahankan tampilan anggota yang ada.
- `pages/verifikasi-transaksi.html`: daftar pengajuan pinjaman, tombol Setujui dan Tolak.
- `pages/kelola-anggota.html`: reset password sementara dan aktivasi/nonaktivasi akun anggota.
- `pages/pengajuan-pinjaman.html`: form nominal, tenor, tujuan pinjaman, dan riwayat pengajuan anggota.
- Middleware client-side mengarahkan pengguna ke login jika belum masuk atau membuka halaman dari peran yang salah.
- Operasi baca/tulis `localStorage` melewati helper `read()` dan `write()` yang memakai `try...catch`.
- Form pengajuan pinjaman memvalidasi nominal, tenor, dan tujuan sebelum menyimpan.
- Tabel kosong menampilkan empty state.

### Akun demo

| Peran | Email | Kata sandi |
|---|---|---|
| Admin | `admin@kopsimpan.id` | `admin123` |
| Anggota | `anggota@kopsimpan.id` | `anggota123` |

Akun demo tambahan untuk anggota yang tersedia di data awal juga menggunakan kata sandi `anggota123`.

**Catatan keamanan:** autentikasi `localStorage` hanya cocok untuk prototipe akademik. Jangan gunakan pola ini untuk data keuangan atau data pribadi nyata. Aplikasi produksi memerlukan autentikasi dan otorisasi di server.
