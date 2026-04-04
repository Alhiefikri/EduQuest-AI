export interface BaseDocument {
  id: string
  filename: string
  filetype: string
  filesize: number
  page_count: number
  word_count: number
  uploaded_at: string
  updated_at: string
}

export interface DocumentItem extends BaseDocument {
  content: string
}

export interface DocumentListResponse extends BaseDocument {}

export interface UploadResponse extends DocumentItem {}

export interface SoalItem {
  nomor: number
  pertanyaan: string
  pilihan?: string[]
  jawaban: string
  pembahasan?: string
  gambar_prompt?: string
}

export interface SoalResponse {
  id: string
  modul_id: string | null
  mata_pelajaran: string
  topik: string | null
  tipe_soal: string
  difficulty: string
  jumlah_soal: number
  include_pembahasan: boolean
  include_kunci: boolean
  include_gambar: boolean
  data_soal: SoalItem[]
  status: string
  created_at: string
  updated_at: string
}

export interface SoalListResponse {
  id: string
  modul_id: string | null
  mata_pelajaran: string
  topik: string | null
  tipe_soal: string
  difficulty: string
  jumlah_soal: number
  status: string
  created_at: string
  updated_at: string
}

export interface GenerateSoalRequest {
  modul_id?: string
  mata_pelajaran: string
  topik?: string
  tipe_soal: string
  jumlah_soal: number
  difficulty: string
  include_pembahasan: boolean
  include_kunci: boolean
  include_gambar: boolean
}

export interface UpdateSoalRequest {
  data_soal?: SoalItem[]
  status?: string
  topik?: string
}

export interface GenerateWordRequest {
  soal_id: string
  template_id?: string
  judul_ujian?: string
  nama_siswa?: string
  kelas?: string
  tanggal?: string
  sertakan_kunci_terpisah: boolean
}

export interface GenerateWordResponse {
  file_path: string
  file_name: string
  message: string
}

export interface ApiError {
  detail: string
  error_code?: string
}
