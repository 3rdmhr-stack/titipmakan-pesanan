# TitipMakan — Form Pesanan

Tugas 2 Praktik CPMK082-1: implementasi komponen dasar antarmuka **Form Pesanan** dari wireframe TitipMakan (Tugas 1) memakai **HTML, CSS, dan JavaScript murni** dengan berkas terpisah.

## Deskripsi

Halaman **Form Pesanan** pada alur jastip TitipMakan. Pengguna mengisi detail titip makanan (menu, harga, resto asal, titik ambil, catatan), melihat **ringkasan biaya live** (subtotal + biaya titip), lalu **mengonfirmasi** lewat dialog sebelum lanjut ke halaman pembayaran escrow.

## Komponen (5)

1. **Header dengan menu ponsel** — pola *disclosure* dengan `aria-expanded` dan `aria-controls`. Menu tertutup default di ponsel, tampil horizontal di layar lebar. Escape menutup menu dan mengembalikan fokus ke tombol.
2. **Kartu jastiper** — info jastiper yang dipilih (nama, rating, jumlah ulasan, status online, biaya titip). Biaya titip disimpan di `data-biaya-titip` dan dibaca JavaScript.
3. **Form pesanan** — validasi menu, harga, resto, dan titik ambil. Pesan galat terhubung via `aria-describedby` + `role="alert"`, kolom salah diberi `aria-invalid="true"`, fokus dipindah ke kolom salah pertama.
4. **Ringkasan biaya + tombol status memuat** — subtotal, biaya titip, dan total di-update live saat `#harga` berubah. Tombol submit `form="form-pesanan"` menampilkan status memuat ("Memproses…" + `aria-busy="true"`) setelah konfirmasi.
5. **Dialog konfirmasi** — memakai `<dialog>` + `showModal()` sehingga browser menangani *focus trap*, Escape, dan backdrop. Menampilkan ringkasan pesanan sebelum diproses.

Bonus: **footer** dengan copyright dan tautan bantuan.

## Struktur Proyek
├── index.html # Struktur halaman
├── styles.css # Semua gaya visual
├── script.js # Interaktivitas
└── README.md # Dokumentasi ini
## Cara Menjalankan

1. Clone repo:
   ```bash
   git clone https://github.com/3rdmhr-stack/titipmakan-pesanan.git
   cd titipmakan-pesanan