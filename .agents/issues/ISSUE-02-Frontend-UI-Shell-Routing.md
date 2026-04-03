# [ISSUE-02] Frontend UI Shell & Routing

**Status:** In Progress  
**Assignee:** Execution Agent  
**Priority:** High  
**Ref:** `PRD.md` Section 8 (UI/UX) & Section 9 (Navigation Flow)  
**Design Reference:** https://stitch.withgoogle.com/projects/17055778945442187045

---

## Deskripsi High-Level

Bangun kerangka UI utama (shell) frontend menggunakan **React Router** untuk navigasi antar halaman. Implementasikan layout global (sidebar + header + content area) dan buat semua halaman utama berdasarkan desain yang sudah tersedia di **Google Stitch** (link di atas).

Gunakan **MCP Stitch** untuk mengambil kode HTML dari setiap screen di project Stitch, lalu konversikan menjadi komponen React + Tailwind CSS v4.

---

## Halaman yang Harus Dibuat (dari Stitch)

| Route | Halaman | Screen ID Stitch |
|-------|---------|-----------------|
| `/` | Dashboard | `ee535f44b79f440a82451ac542ef37ff` |
| `/soal/generate` | Generate Soal Baru | `96552268dfd1402e9d477b50f71612c7` |
| `/soal` | Daftar Soal | `cc905016081740de903bf039aebc0a12` |
| `/soal/edit/:id` | Edit Soal | `67a6264b9ea9416a817e2cb2c84f9692` |
| `/soal/preview/:id` | Preview Word | `560f73d176b34707a436620718afeba6` |

---

## Acceptance Criteria

- [ ] React Router terinstall dan terkonfigurasi.
- [ ] Layout global (Sidebar + Header + Content) berfungsi di semua halaman.
- [ ] Semua 5 route di tabel atas bisa diakses tanpa error.
- [ ] Setiap halaman menampilkan UI sesuai desain Stitch (bisa menggunakan data dummy/hardcoded).
- [ ] Navigasi antar halaman berfungsi melalui sidebar.
- [ ] Responsive design minimal untuk desktop.
- [ ] Tidak ada console error atau warning.

---

## Instruksi Tambahan

- Gunakan `react-router-dom` untuk routing.
- Ambil referensi desain dari MCP Stitch project ID: `17055778945442187045`.
- Data di halaman boleh dummy/hardcoded (belum perlu koneksi ke backend API).
- Pastikan mengikuti aturan Clean Code & Best Practice sesuai `AGENT_WORKFLOW.md`.
