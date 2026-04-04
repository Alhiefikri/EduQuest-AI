# [ISSUE-14] Enhancement: Refine AI Prompting Strategy (Kurikulum Merdeka)

**Status:** Open  
**Assignee:** Execution Agent  
**Priority:** High  
**Type:** Enhancement

---

## Objective
Mengoptimalkan *System Prompt* dan *User Prompt* di `ai_service.py` agar output soal yang dihasilkan benar-benar berfokus pada **evaluasi siswa** yang sesuai dengan tingkat kognitif dan bahasa siswa, bukan panduan atau aktivitas untuk guru kelas.

---

## Latar Belakang Masalah
Saat ini AI diberikan seluruh isi Modul Ajar secara mentah, yang terkadang mengakibatkan AI menghasilkan pertanyaan seputar *cara guru mengajar* (aktivitas pembelajaran) alih-alih soal uji kompetensi untuk siswa.

## Solusi (Insight dari Senior Developer)
Gunakan strategi "Structured Prompting" layaknya mengisi field data (seperti Dapodik). Isolasi konteks agar AI fokus murni pada evaluasi penguasaan materi sesuai *Fase/Kelas* dan *Level Kognitif*.

---

## Scope of Work (Backend)

File target: `backend/app/services/ai_service.py`

### 1. Update `SYSTEM_PROMPT`
Ubah ke persona berikut:
```text
Kamu adalah pendidik profesional yang ahli dalam evaluasi pembelajaran Kurikulum Merdeka. Tugasmu adalah membuat soal evaluasi yang valid, berpusat pada materi pokok, sesuai dengan perkembangan kognitif siswa, dan menggunakan bahasa yang mudah dipahami sesuai tingkat kelas yang diminta.
```

### 2. Update `_build_user_prompt()`
Sesuaikan struktur prompt menjadi seperti berikut (pastikan requirement JSON format tetap dipertahankan!):

```text
Buatkan {jumlah_soal} soal {tipe_soal} berdasarkan parameter berikut:

Fase/Kelas: [Ambil dari parameter, jika tidak ada asumsikan umum]
Mata Pelajaran: {mata_pelajaran}
Tujuan Pembelajaran / Topik: {topik}
Ringkasan Materi:
{_truncate_content(konten_modul)}

Level Kognitif: {difficulty}

Syarat mutlak:
- Fokus murni pada evaluasi penguasaan materi, bukan aktivitas belajar mengajar di kelas.
- Bahasa harus disesuaikan untuk anak-anak sekolah/siswa.
- Jangan tambahkan teks pengantar atau penutup apa pun.
- Output HANYA berupa JSON valid dengan skema berikut... (pertahankan skema JSON yang ada)
```

## Acceptance Criteria
- [ ] `SYSTEM_PROMPT` dan `_build_user_prompt` berhasil diperbarui.
- [ ] Hasil generate soal sudah berfokus untuk anak-anak/siswa, tidak menghasilkan soal panduan bagi guru.
- [ ] Sistem tetap memberikan output JSON yang tertangkap dengan baik oleh `_parse_ai_response()`.
