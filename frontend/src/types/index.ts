export interface DocumentItem {
  id: string
  filename: string
  filetype: string
  filesize: number
  page_count: number
  word_count: number
  content: string
  uploaded_at: string
  updated_at: string
}

export interface DocumentListResponse {
  id: string
  filename: string
  filetype: string
  filesize: number
  page_count: number
  word_count: number
  uploaded_at: string
  updated_at: string
}

export interface UploadResponse {
  id: string
  filename: string
  filetype: string
  filesize: number
  page_count: number
  word_count: number
  content: string
  uploaded_at: string
  updated_at: string
}

export interface ApiError {
  detail: string
  error_code?: string
}
