import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDocuments, uploadDocument, deleteDocument } from '../services/documents'
import type { DocumentListResponse } from '../types'

export const useDocuments = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<DocumentListResponse[]>({
    queryKey: ['documents'],
    queryFn: getDocuments,
  })

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
  })

  return {
    documents: data ?? [],
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    uploadDocument: uploadMutation.mutateAsync,
    deleteDocument: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  }
}
