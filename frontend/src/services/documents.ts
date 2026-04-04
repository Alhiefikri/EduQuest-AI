import type { DocumentItem, DocumentListResponse, UploadResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Terjadi kesalahan pada server' }))
    throw new Error(error.detail || 'Terjadi kesalahan pada server')
  }

  if (response.status === 204) {
    return undefined as unknown as T
  }

  return response.json()
}

export const getDocuments = async (): Promise<DocumentListResponse[]> => {
  return request<DocumentListResponse[]>('/api/v1/documents')
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  return request<UploadResponse>('/api/v1/documents/upload', {
    method: 'POST',
    body: formData,
  })
}

export const deleteDocument = async (id: string): Promise<void> => {
  return request<void>(`/api/v1/documents/${id}`, {
    method: 'DELETE',
  })
}

export const getDocumentDetail = async (id: string): Promise<DocumentItem> => {
  return request<DocumentItem>(`/api/v1/documents/${id}`)
}
