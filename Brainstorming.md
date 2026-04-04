Tugas: Refactoring Arsitektur & Kode Python untuk Sistem Generator Soal AI

Saat ini, sistem penghasil soal evaluasi kita (ai_service.py) menghasilkan output yang berhalusinasi. Hal ini terjadi karena kita memberikan context berupa "Modul Ajar" (Lesson Plan) secara utuh. AI malah membuat soal tentang "kegiatan mengajar di kelas" (seperti tanya jawab guru-siswa), bukan menguji pemahaman materi siswanya. Selain itu, soal terasa kaku dan ada isu konkurensi di kode Python kita.

Tolong bantu saya merombak sistem ini dengan memahami prinsip berikut dan mengimplementasikan perbaikannya:

A. PEMAHAMAN KONSEP (The Right Way)
Agar soal yang dihasilkan akurat, menarik, dan sesuai usia anak (Kurikulum Merdeka):

    Data Grounding: Berhenti menggunakan "Modul Ajar" (RPP). Ganti dengan "Buku Siswa" (Bahan Bacaan Murni) atau ringkasan materi khusus siswa. AI hanya butuh fakta materinya, bukan instruksi pedagogi gurunya.

    Persona & Usia: AI harus diberikan instruksi spesifik terkait target usia. Untuk Fase A (Kelas 1-2 SD / usia 6-8 tahun), kalimat harus sangat pendek, kosakata konkret (benda nyata), dan hindari majas atau kalimat majemuk.

    Contextual Storytelling: Agar soal tidak membosankan, prompt harus menginstruksikan AI untuk membungkus pertanyaan dengan skenario dunia nyata yang dekat dengan anak (misal: bermain di taman, jajan di kantin).

B. INSTRUKSI PERBAIKAN KODE (ai_service.py)
Lakukan refactoring pada kode dengan detail berikut:

    Perbaiki Isu Konkurensi (Blocking Async):

        Saat ini _generate_with_groq dan _generate_with_gemini menggunakan time.sleep() dan pemanggilan client secara sinkronus di dalam environment async. Ini memblokir event loop server.

        Tugas: Ubah menggunakan library AsyncGroq, ganti semua time.sleep() menjadi await asyncio.sleep(), dan jadikan fungsi-fungsinya async def.

    Rombak Fungsi _build_user_prompt:

        Tambahkan Negative Prompt yang sangat tegas: "DILARANG KERAS membuat pertanyaan tentang kegiatan di dalam kelas, metode guru mengajar, alat peraga, atau isi dokumen Modul Ajar."

        Tambahkan instruksi Storytelling/Tema: "Bungkus pertanyaan dengan skenario/cerita pendek yang relevan dengan kehidupan sehari-hari anak seusia target kelas."

        Buat format output JSON untuk pembahasan dan gambar_prompt bersifat dinamis. Jangan paksa key tersebut ada di struktur JSON jika variabel include_pembahasan atau include_gambar bernilai False untuk menghemat token.

    Solusi Context Window (Ganti _truncate_content):

        Fungsi _truncate_content saat ini berisiko memotong bagian materi penting jika file PDF-nya panjang (karena bagian awal biasanya berisi cover/pengantar).

        Tugas: Jangan lakukan pemotongan statis di service ini. Buatlah catatan/TODO di kode agar kita nanti membuat fitur "Ekstraksi PDF Berdasarkan Rentang Halaman" di fungsi controller sebelum data masuk ke konten_modul. AI hanya boleh menerima teks materi murni maksimal 2000-3000 kata.