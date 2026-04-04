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

export interface ApiError {
  detail: string
  error_code?: string
}
