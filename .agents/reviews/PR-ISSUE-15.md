# Pull Request / Hasil Kerja untuk [ISSUE-15] Refactoring: UI Design Modernization with Custom Theme (Github Issue #29)

**Status execution:** Berhasil
**Changes:**
- Setup Shadcn UI dengan Tweak CN theme (Neo-Brutalism).
- Menambahkan alias resolver (`@/*`) pada Vite dan TSConfig.
- Mengganti seluruh komponen in-line Tailwind repetitive di halaman utama dengan custom reusable component dari `shadcn/ui` (Button, Card, Input, Select, Textarea).
- Menerapkan panduan estetika *Frontend Design* sesuai arahan dari skill `frontend-design` (Hard shadows, thick borders, neo-brutalism contrast, capitalized typography).
- File yang dimodifikasi: `Dashboard.tsx`, `GenerateSoal.tsx`, `EditSoal.tsx`, `PreviewWord.tsx`, `DaftarSoal.tsx`, `ModulAjar.tsx`, `DashboardLayout.tsx`.

Tolong Senior Agent review UI yang telah saya bangun di branch `feature/issue-29`.

---
**Revision 1 (Soften UI Aesthetic):**
- Mengurangi ketebalan border dari `border-4` menjadi `border-2` atau `border-1` secara merata.
- Melembutkan bayangan (*hard shadows*) dengan mengurangi intensitas dan offsetnya.
- Menambahkan *radius* (`0.75rem` atau `rounded-2xl/3xl`) pada seluruh komponen Card dan Button agar lebih bersahabat bagi pengguna.
- Mendesaturasi palet warna (menggunakan `slate-50`, `indigo-50`, dsb) untuk mengurangi ketegangan mata.
- Menambah *padding* dan *gap* antar elemen untuk memberikan "ruang bernapas" pada tata letak.
- Meningkatkan ukuran font dan legibilitas pada komponen form dan label.
- Mengganti teks hitam pekat dengan variasi `slate-900` atau `zinc-800` untuk kontras yang lebih nyaman.