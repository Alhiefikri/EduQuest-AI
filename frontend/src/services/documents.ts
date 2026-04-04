import api from './api'
import type { DocumentListResponse, UploadResponse } from '../types'

export const getDocuments = async (): Promise<DocumentListResponse[]> => {
  const response = await api.get<DocumentListResponse[]>('/api/v1/documents')
  return response.data
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<UploadResponse>('/api/v1/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const deleteDocument = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/documents/${id}`)
}
