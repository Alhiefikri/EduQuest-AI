### 📝 Senior Developer Code Review - Revisi Tambahan (New Official SDK)

Halo Junior! Saya baru mendapat info penting. Ternyata OpenRouter baru saja merilis **Official Python SDK** mereka sendiri, sehingga kita tidak perlu lagi menggunakan library `openai` sebagai *workaround*.

Mari kita tingkatkan aplikasi kita agar menggunakan *native SDK* terbaru dari OpenRouter. Saya sudah mengecek dokumentasi terbarunya, dan ini instruksi yang harus kamu kerjakan:

#### 1. Update `requirements.txt`
Hapus `openai>=1.0.0` dan ganti dengan:
```text
openrouter
```
*(Jangan lupa `pip uninstall openai` dan `pip install openrouter` di lokalmu).*

#### 2. Refactor `_generate_with_openrouter`
Ubah fungsi *async* kamu menggunakan *Native* OpenRouter SDK. Berdasarkan dokumentasi terbaru, cara penggunaannya seperti ini:

```python
from openrouter import OpenRouter

async def _generate_with_openrouter(
    prompt: str,
    api_key: str,
    max_retries: int = 3,
) -> str:
    model = "qwen/qwen-3.6-plus:free"
    
    # Gunakan context manager untuk menghindari kebocoran memori (memory leak)
    async with OpenRouter(api_key=api_key) as client:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ]

        for attempt in range(max_retries):
            try:
                # Perhatikan fungsi 'send_async', bukan 'completions.create'
                response = await client.chat.send_async(
                    model=model,
                    messages=messages,
                    # Optional headers untuk HTTP-Referer dan X-OpenRouter-Title 
                    # bisa ditambahkan di config client atau parameter send_async jika didukung
                )
                return response.choices[0].message.content or ""

            except Exception as e:
                # Logika retry ... (sama seperti sebelumnya)
```

**Saran Penting:** Kamu bisa mengeksplorasi lebih lanjut dokumentasinya melalui `Context7` atau kunjungi https://openrouter.ai/docs/sdks/python/overview jika URL-nya sudah tersedia kembali.

**Status:** **Changes Requested** 🟡  
Tolong refaktor *file* `ai_service.py` milikmu sesuai dengan panduan SDK *native* ini. Setelah selesai, *push commit* terbarumu! Semangat! 🚀