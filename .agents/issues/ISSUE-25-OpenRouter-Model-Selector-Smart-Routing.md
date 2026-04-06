# [ISSUE-25] Feature: OpenRouter Model Selector + Smart Routing per Mata Pelajaran

**Status:** Open  
**Assignee:** Junior Execution Agent  
**Prioritas:** Medium 🟡  
**Tipe:** Feature Request  
**Estimasi Effort:** M (2–3 hari kerja)  
**File yang Terdampak:**
- `backend/app/services/ai_service.py`
- `backend/app/config.py`
- `backend/app/routes/settings.py`
- `frontend/src/pages/Settings.tsx`

---

## Deskripsi High-Level

Saat ini provider OpenRouter menggunakan satu model yang di-hardcode di source code (`qwen/qwen3.6-plus:free`). Berdasarkan pengujian aktual, kualitas output berbeda signifikan tergantung mata pelajaran: Qwen unggul di mapel berbasis bahasa (PAI, IPS, Bahasa Indonesia), sedangkan model eksak seperti StepFun lebih kuat untuk Matematika dan IPA.

Feature ini menambahkan dua kemampuan:
1. **Model Selector** di halaman Settings — user dapat memilih model OpenRouter yang digunakan
2. **Smart Routing** — backend otomatis memilih model terbaik berdasarkan mata pelajaran yang di-generate

---

## Acceptance Criteria (Syarat Selesai)

- [ ] Halaman Settings menampilkan section model selector khusus OpenRouter (conditional render, hanya muncul saat OpenRouter dipilih)
- [ ] User dapat memilih dari 3 model preset: Qwen 3.6+, GLM 4.5 Air, StepFun 3.5 Flash
- [ ] User dapat memasukkan custom model ID (`custom` option) dengan input text
- [ ] Toggle "Smart Routing" tersedia — jika aktif, pilihan model di atas di-disable (greyed out)
- [ ] Backend `ai_service.py` tidak lagi menggunakan model hardcoded
- [ ] Fungsi `_resolve_openrouter_model()` yang baru menentukan model berdasarkan mata pelajaran (untuk smart routing) atau pilihan user
- [ ] `_get_ai_config()` di-extend untuk return konfigurasi OpenRouter tambahan (breaking change yang sudah direncanakan)
- [ ] `test_ai_connection()` menguji model yang sedang dipilih user, bukan default
- [ ] Backward compatible: user lama yang belum punya field baru di database tidak error (gunakan default: GLM, smart routing aktif)
- [ ] Semua perubahan diuji secara manual sesuai test case di bawah

---

## Spesifikasi Teknis

### ISS-25A — Perubahan Config & Settings Backend

Tambahkan field baru ke `config.py` untuk membaca dan menyimpan konfigurasi OpenRouter:
- `openrouter_model_key` — key model yang dipilih: `"qwen"` | `"glm"` | `"stepfun"` | `"custom"`  
- `openrouter_custom_model_id` — model ID custom (string, hanya dipakai jika key = "custom")
- `openrouter_smart_routing` — boolean, default `True`

Fungsi `get_ai_config()` perlu di-extend dari return value `tuple[str, str]` menjadi `tuple[str, str, dict]` di mana `dict` berisi konfigurasi extra per provider (untuk OpenRouter: ketiga field di atas).

> ⚠️ **PERHATIAN:** Ini adalah **breaking change** pada return signature `get_ai_config()`. Semua caller di `ai_service.py` (`generate_soal`, `regenerate_single_soal`) **harus diupdate bersamaan** di PR yang sama.

### ISS-25B — Perubahan `ai_service.py`

1. **Hapus** konstanta model hardcoded `model = "qwen/qwen3.6-plus:free"` dari `_generate_with_openrouter()`
2. **Tambahkan** konstanta level modul:
   - `OPENROUTER_MODEL_MAP: dict[str, str]` — mapping key ke model ID
   - `MAPEL_EKSAK: frozenset[str]` — set mata pelajaran yang di-route ke model eksak
   - `MAPEL_KONTEN: frozenset[str]` — set mata pelajaran yang di-route ke model bahasa/konten
3. **Tambahkan** fungsi `_resolve_openrouter_model(mata_pelajaran, model_key, custom_model_id, smart_routing) -> str`
   - Smart routing aktif: pilih StepFun untuk MAPEL_EKSAK, Qwen untuk MAPEL_KONTEN, GLM sebagai default
   - Smart routing nonaktif: gunakan pilihan user (model_key atau custom_model_id)
   - Fallback ke GLM jika custom_model_id kosong saat `model_key == "custom"`
4. **Update** signature `_generate_with_openrouter()` untuk menerima parameter `model: str`
5. **Update** `generate_soal()` dan `regenerate_single_soal()` untuk unpack 3 nilai dari `_get_ai_config()` dan memanggil `_resolve_openrouter_model()` sebelum memanggil `_generate_with_openrouter()`

### ISS-25C — Update `test_ai_connection()`

Ubah signature menjadi `test_ai_connection(provider: str, api_key: str, extra_config: dict = {}) -> str`.

Saat menguji OpenRouter: nonaktifkan smart routing, gunakan model sesuai pilihan user di `extra_config`, bukan default.

### ISS-25D — Frontend Settings UI

Dalam `Settings.tsx`, ketika `aiProvider === 'openrouter'`, tampilkan section tambahan:
1. Radio group untuk memilih model (Qwen / GLM / StepFun / Custom)
2. Input text custom model ID (hidden/disabled kecuali pilihan "Custom" aktif)
3. Toggle "Smart Routing" dengan label dan deskripsi singkat
4. Jika Smart Routing ON → radio group di-disable, tampilkan badge routing per kategori mapel
5. Field baru ini diikutkan dalam payload `POST /api/v1/settings/ai`

**Payload yang dikirim saat simpan (tambahan dari yang sudah ada):**
```
openrouter_model_key: string
openrouter_custom_model_id: string
openrouter_smart_routing: boolean
```

Label di dropdown provider juga harus diperbarui dari hardcoded "OpenRouter (Qwen Free)" menjadi dinamis sesuai model yang aktif.

---

## Urutan Pengerjaan yang Disarankan

```
ISS-25A (perubahan config.py + simpan field baru)
    ↓
ISS-25B (ai_service.py) + ISS-25C (test_ai_connection) ← paralel setelah 25A done
    ↓
ISS-25D (frontend Settings.tsx) ← bisa dimulai paralel dengan 25B/25C
```

---

## Manual Testing yang Wajib Dilakukan

1. **Smart routing aktif:** Generate soal Matematika → log/response menunjukkan StepFun. Generate soal PAI → Qwen. Generate Seni Budaya → GLM (default)
2. **Smart routing nonaktif:** Pilih GLM manual, generate Matematika → GLM yang dipakai (bukan StepFun)
3. **Custom model:** Masukkan model ID custom valid → model tersebut yang dipakai saat generate
4. **Custom kosong:** Pilih "Custom" tapi biarkan input kosong → fallback ke GLM, tidak error
5. **Test koneksi:** "Uji Koneksi" menguji model yang sedang dipilih user, bukan default
6. **Backward compat:** Simulasikan user lama tanpa field baru di DB → tidak error, pakai default

---

## Pertanyaan Terbuka (Perlu Dijawab Senior Sebelum Implementasi)

1. **Breaking change `get_ai_config()`**: Apakah ada caller lain di luar `ai_service.py` yang memanggil fungsi ini? Perlu dicek sebelum mengubah return signature.
2. **Persistensi settings**: Settings saat ini disimpan secara global (per instance, bukan per user). Ini sudah cukup untuk Phase 1.
3. **Validasi custom model ID**: Cukup validasi saat klik "Uji Koneksi", tidak perlu validasi format saat simpan.
4. **`MAPEL_EKSAK` dan `MAPEL_KONTEN`**: Untuk sekarang, hardcode di kode sudah cukup. Konfigurasi via database adalah improvement masa depan.
