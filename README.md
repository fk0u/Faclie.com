# Faclie — Next-Gen Freelance Client Simulator

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Zustand](https://img.shields.io/badge/Zustand-v5.0-brown?style=flat-square)](https://github.com/pmndrs/zustand)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-v12.0-ff007f?style=flat-square&logo=framer)](https://www.framer.com/motion/)
[![Electron](https://img.shields.io/badge/Electron-v33.0-blue?style=flat-square&logo=electron)](https://www.electronjs.org/)

**Faclie** (Freelance Client Simulator) adalah platform simulasi percakapan interaktif berbasis web dan desktop untuk melatih kemampuan negosiasi, manajemen *scope creep*, dan penanganan *red flags* klien. Dirancang menyerupai realita dunia freelance agensi, platform ini menyimulasikan emosi klien yang dinamis, kejadian krisis tak terduga (*surprise events*), serta memberikan rapor evaluasi performa di akhir sesi.

---

## 🌟 Fitur Unggulan

### 1. Hybrid Dialogue Engine & Intent Parsing
Simulator mendeteksi intensitas, penawaran harga, penolakan, atau persetujuan secara dinamis berdasarkan input freelancer. Klien akan merespons menggunakan state emosional (*Satisfaction*, *Patience*, *Urgency*) dan sistem memori jangka pendek/panjang.

### 2. Real-Time Diagnostic Meters & Tabbed Sidebar
-   **Diagnostic Meters**: Status emosional klien (*Satisfaction*, *Patience*, *Urgency*) ditampilkan secara real-time.
-   **Tabbed Sidebar**: Beralih mudah antara tab **Project Spec** (spesifikasi, scope, milestones, risks) dan tab **Client Persona** (psikologi Big-Five, tone bahasa, red flags, dan kesan live klien terhadap Anda berdasarkan memori aktif mereka).

### 3. Advanced Features (Native APIs)
-   🎵 **Synthesized Sound Effects (Web Audio API)**: Sound effect interaktif yang disintesis secara dinamis langsung di browser (suara ketikan, chime notifikasi masuk, alarm sirine darurat saat krisis, dan melodi kemenangan saat proyek sukses). Tanpa perlu mengunduh file suara tambahan.
-   🗣️ **Text-To-Speech Voice Notes (Web Speech API)**: Klien dapat mengirimkan *voice notes* transkrip yang bisa dibacakan langsung menggunakan suara sintesis bahasa Inggris, Indonesia, atau campuran, lengkap dengan penyesuaian nada (*pitch*) dan kecepatan (*rate*) berdasarkan tingkat emosi klien.
-   🛠️ **Custom Client Creator**: Buat klien impian (atau terburuk) Anda sendiri dengan form interaktif glassmorphic. Tentukan traits psikologis mereka menggunakan slider (Agreeableness, Neuroticism, dll.), atur bahasa komunikasi, tingkat kesulitan, serta red flags dan quirks khusus mereka.

### 4. Systemic Security Protections
-   **Input Sanitization**: Penyaringan karakter dan pembersihan tag HTML/Script pada obrolan untuk mencegah XSS & Prompt Injection.
-   **Payload Validation**: Verifikasi skema data input server yang aman dari crash.
-   **IP-Based Rate Limiting**: Pembatasan lalu lintas API (maksimal 30 request/menit per IP) untuk menghemat dan melindungi API key NVIDIA.
-   **Secure Error Handling**: Menutup kebocoran informasi jejak error (error stack trace) pada respons klien.

### 5. Performance Report Card & PDF Exporter
Dapatkan penilaian terperinci mengenai *Professionalism*, *Scope Management*, dan *Negotiation Skill* saat simulasi selesai. Rapor penilaian beserta grafik batang indikator visual hasil performa dan riwayat obrolan lengkap dapat diekspor langsung ke format PDF.

---

## 📂 Struktur Dokumentasi Proyek

Panduan terperinci tentang sistem dan pengembangan dapat ditemukan di folder `docs/`:

1.  📄 **[Arsitektur Proyek](docs/architecture.md)**: Alur kerja data, modularitas Zustand stores, dialogue engine, dan local sound/speech synthesis.
2.  📄 **[Katalog Personas](docs/client_personas.md)**: Metadata lengkap 8 klien bawaan, traits psikologis, tingkat kesulitan, dan red flags mereka.
3.  📄 **[Dialogue Engine & Prompt](docs/dialogue_engine.md)**: Penjelasan cara kerja Intent Parser, Offline Dialogue Tree, dan Prompt LLM terjemahan dinamis (Jaksel, ID, EN).
4.  📄 **[Panduan Desktop App](docs/desktop_app.md)**: Detail kemasan Electron, manajemen server Next.js di background, serta instruksi rilis GitHub.

---

## 🛠️ Panduan Instalasi Lokal

### Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org) (Versi 18 ke atas direkomendasikan).

### Langkah-langkah Web
1.  **Clone repositori**:
    ```bash
    git clone https://github.com/username/faclie.git
    cd faclie
    ```
2.  **Instal dependensi**:
    ```bash
    npm install
    ```
3.  **Jalankan server pengembangan web**:
    ```bash
    npm run dev
    ```
4.  **Buka browser**:
    Akses [http://localhost:3000](http://localhost:3000) (atau port lain yang ditunjuk) untuk melihat aplikasi berjalan secara lokal.

### Langkah-langkah Desktop App (Electron)
Aplikasi desktop dapat dijalankan secara lokal atau dikompilasi menjadi berkas installer:

-   **Jalankan versi desktop dev** (Next.js server + Electron window):
    ```bash
    npm run desktop:dev
    ```
-   **Kompilasi dan pack lokal** (Uji coba build tanpa installer):
    ```bash
    npm run desktop:pack
    ```
-   **Build installer desktop resmi** (Menghasilkan berkas `.exe`, `.dmg`, atau `.AppImage` di folder `dist/`):
    ```bash
    npm run desktop:build
    ```

---

## 🧪 Validasi Build & Linting

Sebelum melakukan push commits ke GitHub, pastikan kode lulus pemeriksaan berikut:

-   **Build check**:
    ```bash
    npm run build
    ```
-   **Linter check**:
    ```bash
    npm run lint
    ```

---

## 📄 Lisensi
Proyek ini dilisensikan di bawah lisensi MIT. Silakan gunakan dan kembangkan secara bebas untuk melatih talenta freelance agensi profesional.
