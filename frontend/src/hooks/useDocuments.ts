import { useState, useEffect, useCallback } from 'react'
import { getDocuments } from '../services/documents'
import type { DocumentListResponse } from '../types'

interface UseDocumentsReturn {
  documents: DocumentListResponse[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useDocuments = (): UseDocumentsReturn => {
  const [documents, setDocuments] = useState<DocumentListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getDocuments()
      setDocuments(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat data dokumen'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return { documents, loading, error, refetch: fetchDocuments }
}
