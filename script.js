/* ==========================================================
   TitipMakan — Interaktivitas Form Pesanan
   Memakai const/let, tanpa var.
   ========================================================== */

const $ = (sel) => document.querySelector(sel);

/* Helper format rupiah */
const rupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID");

/* ==========================================================
   1. HEADER — MENU PONSEL (disclosure)
   ========================================================== */
const tombolMenu = $("#tombol-menu");
const menuUtama  = $("#menu-utama");
const mqlMobile  = window.matchMedia("(max-width: 640px)");

function sinkronkanMenuAwal() {
  if (mqlMobile.matches) {
    menuUtama.hidden = true;
    tombolMenu.setAttribute("aria-expanded", "false");
  } else {
    menuUtama.hidden = false;
    tombolMenu.setAttribute("aria-expanded", "true");
  }
}

tombolMenu.addEventListener("click", () => {
  const terbuka = tombolMenu.getAttribute("aria-expanded") === "true";
  tombolMenu.setAttribute("aria-expanded", String(!terbuka));
  menuUtama.hidden = terbuka;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !menuUtama.hidden && mqlMobile.matches) {
    menuUtama.hidden = true;
    tombolMenu.setAttribute("aria-expanded", "false");
    tombolMenu.focus();
  }
});

mqlMobile.addEventListener("change", sinkronkanMenuAwal);
sinkronkanMenuAwal();

/* ==========================================================
   2. KARTU JASTIPER — baca biaya titip
   ========================================================== */
const kartuJastiper = $(".kartu-jastiper");
const biayaTitip = Number(kartuJastiper.dataset.biayaTitip) || 0;

/* ==========================================================
   3. RINGKASAN BIAYA — update live saat #harga berubah
   ========================================================== */
const inputHarga         = $("#harga");
const ringkasanSubtotal  = $("#ringkasan-subtotal");
const ringkasanTitip     = $("#ringkasan-titip");
const ringkasanTotal     = $("#ringkasan-total");

function perbaruiRingkasan() {
  const subtotal = Number(inputHarga.value) || 0;
  ringkasanSubtotal.textContent = rupiah(subtotal);
  ringkasanTitip.textContent    = rupiah(biayaTitip);
  ringkasanTotal.textContent    = rupiah(subtotal + biayaTitip);
}

inputHarga.addEventListener("input", perbaruiRingkasan);
perbaruiRingkasan();

/* ==========================================================
   4. FORM — VALIDASI, DIALOG, STATUS MEMUAT
   ========================================================== */
const formPesanan  = $("#form-pesanan");
const inputMenu    = $("#menu");
const inputResto   = $("#resto");
const inputTitik   = $("#titik-ambil");
const inputCatatan = $("#catatan");

const galatMenu  = $("#galat-menu");
const galatHarga = $("#galat-harga");
const galatResto = $("#galat-resto");
const galatTitik = $("#galat-titik");

const tombolLanjut = $("#tombol-lanjut");
const pesan        = $("#pesan");

const dialog        = $("#dialog-konfirmasi");
const ringkasDialog = $("#ringkas-dialog");
const tombolYa      = $("#ya");
const tombolTidak   = $("#tidak");

/* Simpan data pesanan sementara sampai dialog dikonfirmasi */
let pesananTertunda = null;

function validasiForm(event) {
  event.preventDefault();

  // Reset pesan & status galat
  galatMenu.textContent = "";
  galatHarga.textContent = "";
  galatResto.textContent = "";
  galatTitik.textContent = "";
  pesan.textContent = "";
  [inputMenu, inputHarga, inputResto, inputTitik].forEach((el) =>
    el.removeAttribute("aria-invalid")
  );

  let kolomSalahPertama = null;

  // Validasi menu
  if (!inputMenu.value.trim()) {
    galatMenu.textContent = "Menu wajib diisi.";
    inputMenu.setAttribute("aria-invalid", "true");
    kolomSalahPertama = inputMenu;
  }

  // Validasi harga
  const hargaNum = Number(inputHarga.value);
  if (!inputHarga.value || Number.isNaN(hargaNum) || hargaNum <= 0) {
    galatHarga.textContent = "Harga wajib diisi dengan angka lebih dari 0.";
    inputHarga.setAttribute("aria-invalid", "true");
    if (!kolomSalahPertama) kolomSalahPertama = inputHarga;
  }

  // Validasi resto
  if (!inputResto.value.trim()) {
    galatResto.textContent = "Resto asal wajib diisi.";
    inputResto.setAttribute("aria-invalid", "true");
    if (!kolomSalahPertama) kolomSalahPertama = inputResto;
  }

  // Validasi titik ambil
  if (!inputTitik.value.trim()) {
    galatTitik.textContent = "Titik ambil wajib diisi.";
    inputTitik.setAttribute("aria-invalid", "true");
    if (!kolomSalahPertama) kolomSalahPertama = inputTitik;
  }

  // Jika ada kolom salah, fokus ke yang pertama dan berhenti
  if (kolomSalahPertama) {
    kolomSalahPertama.focus();
    return;
  }

  // Semua valid — simpan data sementara & buka dialog konfirmasi
  pesananTertunda = {
    menu:    inputMenu.value.trim(),
    harga:   hargaNum,
    resto:   inputResto.value.trim(),
    titik:   inputTitik.value.trim(),
    catatan: inputCatatan.value.trim(),
    total:   hargaNum + biayaTitip,
  };

  ringkasDialog.textContent =
    `${pesananTertunda.menu} dari ${pesananTertunda.resto}, ` +
    `antar ke ${pesananTertunda.titik}. ` +
    `Total ${rupiah(pesananTertunda.total)} (termasuk biaya titip).`;

  dialog.showModal();
}

formPesanan.addEventListener("submit", validasiForm);

/* #tidak — tutup dialog tanpa aksi */
tombolTidak.addEventListener("click", () => {
  dialog.close();
  pesananTertunda = null;
});

/* #ya — tutup dialog, tampilkan status memuat, lalu pesan sukses */
tombolYa.addEventListener("click", () => {
  dialog.close();

  // Status memuat
  const teksAsli = tombolLanjut.textContent;
  tombolLanjut.disabled = true;
  tombolLanjut.textContent = "Memproses…";
  tombolLanjut.setAttribute("aria-busy", "true");

  // Simulasi proses server 800 ms
  setTimeout(() => {
    tombolLanjut.disabled = false;
    tombolLanjut.textContent = teksAsli;
    tombolLanjut.setAttribute("aria-busy", "false");
    pesan.textContent = "Pesanan dibuat. Lanjut ke pembayaran escrow.";
    pesananTertunda = null;
  }, 800);
});