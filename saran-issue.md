# ISSUE: OpenRouter Model Selector + Smart Routing per Mata Pelajaran

> **Status**: Ready for Review  
> **Prioritas**: Medium 🟡  
> **Tipe**: Feature Request  
> **Estimasi Effort**: M (2-3 hari kerja)  
> **File yang terdampak**:
> - `backend/app/services/ai_service.py`
> - `backend/app/models/settings.py` (atau schema yang relevan)
> - `backend/app/config.py`
> - `frontend/` — halaman Settings

---

## Latar Belakang

Saat ini provider OpenRouter hanya menggunakan satu model yang di-hardcode di kode:

```python
# ai_service.py — hardcoded, tidak bisa diubah user
model = "qwen/qwen3.6-plus:free"
```

Masalahnya, berdasarkan pengujian aktual:
- **Qwen** bagus untuk mapel berbasis konsep (PAI, IPS, Bahasa) — distractor lebih natural
- **GLM 4.5 Air** bagus untuk semua mapel dengan JSON compliance yang solid
- **StepFun Step 3.5 Flash** lebih kuat untuk mapel eksak (Matematika, IPA)
- Tiap user mungkin punya preferensi atau akses model yang berbeda

Solusi: tambahkan **model selector di halaman Settings** untuk OpenRouter, sekaligus implementasikan **smart routing otomatis** berdasarkan mata pelajaran di backend.

---

## Spesifikasi Fitur

### Bagian 1 — UI Settings: Model Selector OpenRouter

Ketika user memilih provider **OpenRouter**, tampilkan opsi tambahan:

```
Provider: [Groq] [OpenRouter ✓] [Gemini]

── Muncul hanya saat OpenRouter dipilih ──────────────────
Model OpenRouter:
  ○ Qwen 3.6+ (qwen/qwen3.6-plus:free)
      Terbaik untuk PAI, IPS, Bahasa Indonesia
  ○ GLM 4.5 Air (z-ai/glm-4.5-air:free)  ← default
      Seimbang untuk semua mata pelajaran
  ○ StepFun 3.5 Flash (stepfun/step-3.5-flash:free)
      Terbaik untuk Matematika dan IPA
  ○ Custom — masukkan model ID sendiri:
      [________________________] ← input text

☑ Aktifkan Smart Routing (Rekomendasi)
  Pilih model terbaik otomatis berdasarkan mata pelajaran,
  mengabaikan pilihan di atas jika diaktifkan.
──────────────────────────────────────────────────────────
```

**Catatan UX penting:**
- Jika "Smart Routing" diaktifkan, radio button model di-disable (greyed out) dengan tooltip "Model dipilih otomatis"
- Input custom hanya muncul/aktif jika radio "Custom" dipilih
- Tombol "Test Koneksi" tetap ada dan menguji model yang dipilih

---

## Spesifikasi Teknis

### ISS-10A — Perubahan Schema/Model Settings (Backend)

Tambahkan field baru ke schema settings yang menyimpan konfigurasi OpenRouter:

```python
# Di schema Pydantic settings (sesuaikan dengan file yang ada)
class OpenRouterConfig(BaseModel):
    model_key: str = "glm"          # "qwen" | "glm" | "stepfun" | "custom"
    custom_model_id: str = ""       # hanya dipakai jika model_key == "custom"
    smart_routing: bool = True      # aktifkan routing otomatis per mapel

class AISettings(BaseModel):
    provider: str = "groq"          # "groq" | "openrouter" | "gemini"
    api_key: str = ""
    openrouter: OpenRouterConfig = OpenRouterConfig()
```

**Catatan untuk junior:**
- Jika settings disimpan sebagai flat key-value di database, gunakan prefix:
  `openrouter_model_key`, `openrouter_custom_model_id`, `openrouter_smart_routing`
- Pastikan backward compatible — user yang sudah punya settings lama
  tidak error saat upgrade (gunakan default value)

---

### ISS-10B — Perubahan `ai_service.py` (Backend)

#### Langkah 1 — Ganti konstanta model hardcoded dengan mapping

```python
# Hapus ini:
# model = "qwen/qwen3.6-plus:free"  ← HAPUS

# Tambahkan konstanta ini di level modul, setelah MAPEL_EKSAK
OPENROUTER_MODEL_MAP: dict[str, str] = {
    "qwen":    "qwen/qwen3.6-plus:free",
    "glm":     "z-ai/glm-4.5-air:free",
    "stepfun": "stepfun/step-3.5-flash:free",
}

# Mapel yang routing-nya ke model eksak jika smart routing aktif
MAPEL_EKSAK: frozenset[str] = frozenset({
    "matematika",
    "ipa",
    "ilmu pengetahuan alam",
    "fisika",
    "kimia",
    "biologi",
})

# Mapel yang routing-nya ke model bahasa/konten jika smart routing aktif
MAPEL_KONTEN: frozenset[str] = frozenset({
    "pendidikan agama islam",
    "pai",
    "agama",
    "pendidikan agama",
    "ppkn",
    "pkn",
    "ips",
    "ilmu pengetahuan sosial",
    "bahasa indonesia",
    "bahasa inggris",
    "seni budaya",
})
```

#### Langkah 2 — Tambahkan fungsi resolver model

```python
def _resolve_openrouter_model(
    mata_pelajaran: str,
    model_key: str = "glm",
    custom_model_id: str = "",
    smart_routing: bool = True,
) -> str:
    """
    Tentukan model OpenRouter yang akan dipakai berdasarkan:
    1. Jika smart_routing aktif → pilih berdasarkan mata pelajaran
    2. Jika smart_routing nonaktif → pakai pilihan user (model_key / custom)
    
    Smart routing logic:
    - Mapel eksak (Matematika, IPA, dll) → StepFun (reasoning kuat)
    - Mapel konten (PAI, IPS, Bahasa, dll) → Qwen (bahasa Indonesia natural)
    - Mapel lain / tidak dikenal → GLM (default, seimbang)
    """
    if smart_routing:
        mapel_lower = mata_pelajaran.lower().strip()
        
        if mapel_lower in MAPEL_EKSAK:
            return OPENROUTER_MODEL_MAP["stepfun"]
        
        if mapel_lower in MAPEL_KONTEN:
            return OPENROUTER_MODEL_MAP["qwen"]
        
        # Default untuk mapel tidak dikenal
        return OPENROUTER_MODEL_MAP["glm"]
    
    # Smart routing nonaktif — pakai pilihan user
    if model_key == "custom":
        if not custom_model_id.strip():
            # Fallback ke default jika custom kosong
            return OPENROUTER_MODEL_MAP["glm"]
        return custom_model_id.strip()
    
    return OPENROUTER_MODEL_MAP.get(model_key, OPENROUTER_MODEL_MAP["glm"])
```

#### Langkah 3 — Update `_generate_with_openrouter()` signature

```python
async def _generate_with_openrouter(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
    model: str = OPENROUTER_MODEL_MAP["glm"],  # ← terima model yang sudah diresolved
) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt},
    ]

    for attempt in range(max_retries):
        try:
            async with OpenRouter(
                api_key=api_key,
                http_referer="https://github.com/Alhiefikri/EduQuest-AI",
                x_open_router_title="EduQuest AI"
            ) as client:
                response = await client.chat.send_async(
                    model=model,          # ← gunakan model yang diterima
                    messages=messages,
                    temperature=0.2,
                    top_p=0.85,
                    max_tokens=4096,
                )
                return response.choices[0].message.content or ""

        except Exception as e:
            # ... error handling yang sudah ada, tidak berubah
```

#### Langkah 4 — Update `_get_ai_config()` untuk return config lengkap

Saat ini `_get_ai_config()` hanya return `(provider, api_key)`. Perlu di-extend untuk return konfigurasi OpenRouter juga:

```python
async def _get_ai_config() -> tuple[str, str, dict]:
    """
    Return: (provider, api_key, extra_config)
    extra_config berisi konfigurasi tambahan per provider.
    Untuk OpenRouter: {"model_key": str, "custom_model_id": str, "smart_routing": bool}
    Untuk provider lain: {} (dict kosong)
    """
    from app.config import get_ai_config as _get_config
    return await _get_config()
```

**Catatan:** Perubahan ini adalah breaking change pada return value `_get_ai_config()`.
Pastikan `app/config.py` diupdate bersamaan dan semua pemanggilan fungsi ini
di `generate_soal()` dan `regenerate_single_soal()` juga diupdate.

#### Langkah 5 — Update `generate_soal()` untuk pakai resolver

```python
async def generate_soal(...) -> List[dict]:
    if tipe_konten is None:
        tipe_konten = TipeKonten(_detect_tipe_konten(konten_modul))

    prompt = _build_user_prompt(...)

    provider, api_key, extra_config = await _get_ai_config()  # ← unpack 3 nilai

    if not api_key:
        raise RuntimeError("API key belum dikonfigurasi.")

    last_error: Exception | None = None

    for attempt in range(max_retries):
        try:
            if provider == "groq":
                response_text = await _generate_with_groq(prompt, api_key, max_retries=1)
            elif provider == "openrouter":
                # Resolve model berdasarkan config user + mata pelajaran
                resolved_model = _resolve_openrouter_model(
                    mata_pelajaran=mata_pelajaran,
                    model_key=extra_config.get("model_key", "glm"),
                    custom_model_id=extra_config.get("custom_model_id", ""),
                    smart_routing=extra_config.get("smart_routing", True),
                )
                response_text = await _generate_with_openrouter(
                    prompt, api_key,
                    max_retries=1,
                    model=resolved_model,
                )
            else:
                response_text = await _generate_with_gemini(prompt, api_key, max_retries=1)

            # ... sisa kode tidak berubah
```

Lakukan hal yang sama di `regenerate_single_soal()`.

---

### ISS-10C — Update `test_ai_connection()` untuk test model yang dipilih

```python
async def test_ai_connection(provider: str, api_key: str, extra_config: dict = {}) -> str:
    if not api_key:
        raise ValueError("API key tidak boleh kosong")

    if provider == "groq":
        await _generate_with_groq("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)
    elif provider == "openrouter":
        # Test dengan model yang dipilih user, bukan default
        test_model = _resolve_openrouter_model(
            mata_pelajaran="",           # kosong = pakai default (GLM)
            model_key=extra_config.get("model_key", "glm"),
            custom_model_id=extra_config.get("custom_model_id", ""),
            smart_routing=False,         # saat test, nonaktifkan smart routing
        )
        await _generate_with_openrouter(
            "Respond with exactly: {\"status\": \"ok\"}",
            api_key,
            max_retries=1,
            model=test_model,
        )
    else:
        await _generate_with_gemini("Respond with exactly: {\"status\": \"ok\"}", api_key, max_retries=1)

    return "Koneksi berhasil"
```

---

### ISS-10D — Frontend: UI Settings

Ini dikerjakan oleh frontend developer. Berikan spesifikasi ini:

**Behavior yang diharapkan:**

1. Radio button provider (Groq / OpenRouter / Gemini) — sudah ada, tidak berubah
2. Ketika user pilih **OpenRouter**, section tambahan muncul (conditional render)
3. Di section tersebut:
   - Radio group model: Qwen / GLM / StepFun / Custom
   - Input text custom model ID (disabled kecuali radio "Custom" dipilih)
   - Toggle/checkbox Smart Routing dengan deskripsi singkat
   - Jika Smart Routing ON → radio group di-disable, tampilkan badge per model
     (contoh: "Matematika → StepFun", "PAI → Qwen", "Lainnya → GLM")
4. Tombol "Simpan" menyimpan semua field ke backend
5. Tombol "Test Koneksi" memanggil `test_ai_connection` dengan config yang sedang aktif

**Payload yang dikirim saat simpan:**
```json
{
  "provider": "openrouter",
  "api_key": "sk-or-...",
  "openrouter_model_key": "glm",
  "openrouter_custom_model_id": "",
  "openrouter_smart_routing": true
}
```

---

## Urutan Pengerjaan

```
ISS-10A (schema settings)
    ↓
ISS-10B (ai_service.py) + ISS-10C (test connection) ← bisa paralel setelah 10A
    ↓
ISS-10D (frontend UI) ← bisa dimulai paralel dengan 10B/10C menggunakan mock data
```

---

## Testing Manual Sebelum Merge

1. **Test smart routing aktif:**
   - Set provider OpenRouter, aktifkan Smart Routing
   - Generate soal Matematika → pastikan log menunjukkan StepFun dipilih
   - Generate soal PAI → pastikan log menunjukkan Qwen dipilih
   - Generate soal Seni Budaya (tidak dikenal) → pastikan GLM dipilih

2. **Test smart routing nonaktif:**
   - Pilih model GLM secara manual, nonaktifkan Smart Routing
   - Generate soal Matematika → pastikan GLM yang dipakai (bukan StepFun)

3. **Test custom model:**
   - Pilih "Custom", masukkan `mistralai/mistral-7b-instruct:free`
   - Generate soal → pastikan model ID custom yang dipakai

4. **Test custom kosong:**
   - Pilih "Custom", biarkan input kosong
   - Generate soal → pastikan fallback ke GLM, tidak error

5. **Test backward compatibility:**
   - Simulasikan user lama yang belum punya field `openrouter_model_key` di database
   - Pastikan tidak error dan menggunakan default (GLM, smart routing aktif)

6. **Test koneksi:**
   - Klik "Test Koneksi" untuk masing-masing pilihan model
   - Pastikan response "Koneksi berhasil" muncul untuk model yang valid
   - Masukkan model ID yang tidak ada → pastikan pesan error yang jelas

---

## Pertanyaan Terbuka untuk Diskusi Senior

1. **Breaking change `_get_ai_config()`**: Apakah lebih aman membuat fungsi baru `_get_ai_config_v2()` dan deprecate yang lama, atau langsung update return value? Jika ada caller lain di luar `ai_service.py` yang memanggil config ini, perlu dicek dulu.

2. **Persistensi konfigurasi**: Saat ini tidak jelas apakah settings disimpan per-user atau global per-instance aplikasi. Jika per-user, perlu tambahkan `user_id` ke konteks pengambilan config.

3. **Validasi custom model ID**: Apakah perlu validasi format (misal: harus mengandung `/`) sebelum disimpan? Atau cukup validasi saat "Test Koneksi" ditekan?

4. **MAPEL_EKSAK dan MAPEL_KONTEN**: Set ini perlu di-maintain seiring bertambahnya mata pelajaran. Apakah lebih baik ini dikonfigurasi dari database/admin panel, atau hardcode di kode sudah cukup untuk saat ini?

---

*Issue ini adalah lanjutan dari ISSUE.md dan ISSUE_tambahan_tipe_konten.md.*  
*Smart routing yang diimplementasi di sini menyelesaikan diskusi tentang perbedaan kualitas*  
*Groq vs Qwen untuk mata pelajaran berbeda yang ditemukan saat pengujian aktual.*