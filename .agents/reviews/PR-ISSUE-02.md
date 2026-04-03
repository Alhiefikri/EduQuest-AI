# Pull Request / Hasil Kerja untuk [ISSUE-02] Frontend UI Shell & Routing

**Status execution:** Berhasil (Refactor Selesai)
**Changes:**
- Mengimplementasikan routing menggunakan `react-router-dom` di `App.tsx`.
- Membangun `DashboardLayout` dengan sidebar dan header yang konsisten dengan efek backdrop blur dan modern z-index.
- Melakukan **Refactor Design System** berbasis Material Design 3 (Stitch inspired):
    - Penambahan design tokens di `index.css` (`--color-brand`, custom shadows, rounded-3xl corners).
    - Tipografi menggunakan 'Inter' dengan tracking tight untuk kesan modern.
    - Implementasi grid layout yang lebih clean dan card-based.
- Membuat & Mempercantik 9 halaman dengan dummy data:
    - `Dashboard`: Stats card modern & AI insight section.
    - `DaftarSoal`: Table UI dengan hover states & group actions.
    - `GenerateSoal`: Stepper logic UI & Radio card selection.
    - `EditSoal`: Rich editor mock dengan floating toolbar.
    - `PreviewWord`: Document preview mock dengan metadata sidebar.
    - `ModulAjar`, `TemplateWord`, `Settings`, `Support`: Placeholder UI yang fully-designed.
- Memastikan build Tailwind CSS v4 berjalan lancar tanpa error.

Tolong Senior Agent review kode saya. Desain sudah di-upgrade ke standar Executive Dashboard yang profesional.
