# TODO - Perapihan Tata Letak (Jalan Santai RW 04)

## Step 1: Analisis & baseline
- [x] Baca `index.html` dan `style.css` untuk melihat struktur grid/layout.
- [x] Identifikasi potensi penyebab layout berantakan: grid responsif belum konsisten, countdown floating berpotensi overlap, section padding + nav fixed.

## Step 2: Implementasi perbaikan CSS layout
- [ ] Rapikan `main-layout` dan flow sidebar agar lebih stabil lintas breakpoint.
- [ ] Konsistensikan grid: `stats`, `info`, `gallery` pada breakpoint <1000px dan <768px.
- [ ] Ubah strategi `floating-countdown` supaya tidak menabrak elemen pada mobile (jadi normal flow / lebih aman position).
- [ ] Atur spacing section yang lebih rapi terhadap navbar fixed.



## Step 3: Validasi manual
- [ ] Buka website pada ukuran: desktop (~1280px), tablet (1000px & 768px), mobile (550px & 400px) dan cek: overlap, jarak antar blok, dan tinggi section.

## Step 4: (Opsional) perapihan kecil HTML
- [ ] Jika countdown butuh wrapper flow lebih baik, edit `index.html` seperlunya.

