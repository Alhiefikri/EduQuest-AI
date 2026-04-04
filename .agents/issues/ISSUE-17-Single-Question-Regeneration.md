# [ISSUE-17] Feature: Single Question Regeneration with User Feedback

**Status:** Review  
**Assignee:** Execution Agent  
**Priority:** High  
**Type:** Feature

---

## Objective
Memungkinkan user untuk me-regenerate **satu soal spesifik** yang dirasa kurang menarik atau tidak sesuai, tanpa harus membuat ulang seluruh bank soal. User juga bisa memberikan konteks/instruksi tambahan saat regenerate.

## Alur UX yang Diinginkan
1. User sudah selesai generate (misal 10 soal).
2. Di halaman **Edit Soal**, setiap kartu soal memiliki tombol **"🔄 Regenerate"**.
3. Saat tombol ditekan, muncul **modal/popover** berisi:
   - Textarea untuk instruksi opsional dari user (contoh: "Sederhanakan bahasa", "Ganti ke konteks bermain di taman", "Buat lebih menantang").
   - Tombol "Generate Ulang".
4. Sistem mengirim request ke backend dengan: soal lama + konteks user + materi asal.
5. Backend menghasilkan **1 soal pengganti** yang berbeda dari soal lama.
6. Frontend meng-update **hanya soal tersebut** di array state (bukan seluruh list).
7. Loading spinner hanya muncul di kartu soal yang sedang diproses.

## Scope of Work

### Backend (`ai_service.py`)
- Buat fungsi baru `regenerate_single_soal()` yang menerima:
  - `soal_lama` (pertanyaan + jawaban lama)
  - `feedback_user` (instruksi opsional dari guru)
  - Parameter standar (mata_pelajaran, fase_kelas, difficulty, konten_modul)
- Prompt harus menginstruksikan AI: *"Buat 1 soal BARU yang BERBEDA dari soal lama berikut, tetap berdasarkan materi yang sama."*
- Jika ada `feedback_user`, tambahkan ke prompt sebagai instruksi tambahan.

### Backend Route (`soal.py`)
- Buat endpoint baru: `POST /api/v1/soal/{soal_id}/regenerate`
- Request body: `{ "nomor_soal": 3, "feedback": "Sederhanakan bahasa" }`
- Response: 1 objek soal pengganti.

### Frontend (`EditSoal.tsx`)
- Tambahkan tombol "Regenerate" di setiap kartu soal.
- Buat modal/popover sederhana dengan textarea feedback.
- Saat response diterima, update hanya item yang bersangkutan di state array.
- Tampilkan loading spinner hanya pada kartu soal yang sedang diproses.

## Ketentuan
- **Selalu gunakan `context7` untuk dokumentasi terbaru library.**
- Jangan ubah alur generate bulk yang sudah ada.
- Pastikan regenerate tetap menggunakan provider AI yang aktif (Gemini/Groq) sesuai settings.

## Acceptance Criteria
- [ ] Endpoint `POST /api/v1/soal/{soal_id}/regenerate` berfungsi.
- [ ] Fungsi `regenerate_single_soal()` menghasilkan soal yang berbeda dari soal lama.
- [ ] User bisa memberikan feedback/instruksi tambahan saat regenerate.
- [ ] UI hanya memperbarui 1 soal yang di-regenerate (bukan seluruh list).
- [ ] Loading state hanya muncul di kartu soal yang sedang diproses.
