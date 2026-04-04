import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { generateSoal, getSoalList, getSoalDetail, updateSoal, deleteSoal, regenerateSingleSoal } from '../services/soal'
import type { GenerateSoalRequest, UpdateSoalRequest, RegenerateSingleSoalRequest, SoalItem } from '../types'

export const useSoalList = () => {
  return useQuery({
    queryKey: ['soal-list'],
    queryFn: () => getSoalList(),
  })
}

export const useSoalDetail = (id: string) => {
  return useQuery({
    queryKey: ['soal-detail', id],
    queryFn: () => getSoalDetail(id),
    enabled: !!id,
  })
}

export const useGenerateSoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateSoalRequest) => generateSoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soal-list'] })
    },
  })
}

export const useUpdateSoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSoalRequest }) => updateSoal(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['soal-detail', id] })
      queryClient.invalidateQueries({ queryKey: ['soal-list'] })
    },
  })
}

export const useDeleteSoal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['soal-list'] })
    },
  })
}

export const useRegenerateSingleSoal = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RegenerateSingleSoalRequest }) =>
      regenerateSingleSoal(id, data),
  })
}
