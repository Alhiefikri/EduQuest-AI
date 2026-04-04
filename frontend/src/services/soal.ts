import type { GenerateSoalRequest, GenerateWordRequest, GenerateWordResponse, SoalListResponse, SoalResponse, UpdateSoalRequest, SoalItem, RegenerateSingleSoalRequest } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
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

export const generateSoal = async (data: GenerateSoalRequest): Promise<SoalResponse> => {
  return request<SoalResponse>('/api/v1/soal/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const getSoalList = async (skip = 0, limit = 20): Promise<SoalListResponse[]> => {
  return request<SoalListResponse[]>(`/api/v1/soal?skip=${skip}&limit=${limit}`)
}

export const getSoalDetail = async (id: string): Promise<SoalResponse> => {
  return request<SoalResponse>(`/api/v1/soal/${id}`)
}

export const updateSoal = async (id: string, data: UpdateSoalRequest): Promise<SoalResponse> => {
  return request<SoalResponse>(`/api/v1/soal/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export const deleteSoal = async (id: string): Promise<void> => {
  return request<void>(`/api/v1/soal/${id}`, {
    method: 'DELETE',
  })
}

export const generateWord = async (data: GenerateWordRequest): Promise<GenerateWordResponse> => {
  return request<GenerateWordResponse>('/api/v1/word/generate', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export const downloadWord = async (soalId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/api/v1/word/download/${soalId}`)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Gagal mengunduh file' }))
    throw new Error(error.detail || 'Gagal mengunduh file')
  }

  const blob = await response.blob()
  const disposition = response.headers.get('Content-Disposition')
  let filename = `soal_${soalId}.docx`
  if (disposition && disposition.includes('filename')) {
    const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, '')
    }
  }

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export const regenerateSingleSoal = async (id: string, data: RegenerateSingleSoalRequest): Promise<SoalItem> => {
  return request<SoalItem>(`/api/v1/soal/${id}/regenerate`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
