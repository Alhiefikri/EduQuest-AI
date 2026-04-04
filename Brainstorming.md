Tugas: Bangun alur kerja (workflow) sistem pembuatan soal dengan fitur Step-by-Step, Modal Page Selector, dan Single Question Regeneration.
1. Alur Wizard (Frontend State Management)

Implementasikan sistem stepper dengan 4 tahap utama:

    Step 1: Source Selection. User memilih sumber materi: "Upload PDF" atau "Input Manual".

    Step 2: Context Filtering. * Jika PDF: Munculkan Modal Preview. User memilih range halaman. Sistem melakukan ekstraksi teks hanya pada halaman terpilih.

        Jika Manual: Tampilkan textarea untuk copy-paste materi.

    Step 3: AI Configuration. User memilih: Mata Pelajaran, Fase/Kelas, Jumlah Soal, dan Level Kognitif (L1/L2/HOTS).

    Step 4: Review & Editor. Menampilkan daftar soal hasil generate. Setiap soal memiliki tombol "Regenerate" sendiri.

2. Fitur Modal Preview & Page Extraction

    Buat fungsi di Python (menggunakan PyMuPDF atau pdfplumber) yang menerima file_path dan list_halaman.

    Fungsi harus mengembalikan gabungan teks (string) hanya dari halaman-halaman tersebut untuk dikirim sebagai konten_modul ke AI.

3. Arsitektur API: Single vs. Bulk Generation

Modifikasi ai_service.py agar mendukung dua skenario:

    Bulk Generate: Fungsi generate_soal yang sudah ada (menghasilkan n soal sekaligus).

    Single Regenerate: Buat fungsi regenerate_single_soal.

        Input: Parameter awal (Kelas/Materi) + soal_lama + feedback_user (opsional).

        Prompt Logic: Instruksikan AI untuk membuat soal baru yang berbeda dari soal_lama namun tetap merujuk pada konten_modul yang sama.

4. Logic Frontend untuk Per Soal (Next.js/Laravel context)

    Simpan daftar soal dalam sebuah array of objects di state (misal: questions).

    Saat tombol "Regenerate" pada Soal #3 ditekan:

        Kirim ID soal dan konteksnya ke API.

        Saat API merespons dengan 1 soal baru, lakukan update hanya pada questions[2] (index ke-2).

        Tampilkan loading spinner hanya pada kartu soal yang sedang diperbarui.

5. UI/UX Requirement

    Gunakan komponen Modal yang responsive untuk preview PDF.

    Tampilkan pesan indikator: "Sedang memproses halaman [x, y, z]..." agar guru tahu sistem bekerja sesuai pilihannya.

    Pada tombol Regenerate per soal, tambahkan opsi cepat: "Sederhanakan Bahasa" atau "Ganti Konsep".

Review & Feedback:
Review alur di atas. Jika ada kendala pada library PDF atau limitasi token pada Groq/Gemini saat proses regenerasi, berikan saran perbaikan sebelum mulai menulis kode.
Sedikit Saran Tambahan untuk Kamu:

    Penyimpanan Sementara (Cache): Saat guru memilih halaman PDF di Step 2, sebaiknya teks hasil ekstraksinya disimpan di state atau session sementara. Jadi, saat guru menekan tombol "Regenerate" di Step 4, kamu tidak perlu memproses ulang file PDF dari nol—cukup kirim teks yang sudah diekstrak tadi.

    User Feedback: Untuk tombol regenerasi per soal, saran saya sediakan input teks kecil yang opsional. Terkadang guru ingin bilang: "Soal ini terlalu panjang, ringkas jadi 1 kalimat saja". Jika AI menerima instruksi spesifik seperti itu, hasilnya akan jauh lebih memuaskan.