import { useMutation, useQueryClient, queryOptions } from "@tanstack/react-query"
import { UserSearchParams } from "../types/user"
import { USER_QUERY_KEYS } from "./query-keys"
import { userService } from "../services/userService"

export const userQueries = {
  list: (params: UserSearchParams) =>
    queryOptions({
      queryKey: USER_QUERY_KEYS.list(params),
      queryFn: () => {
        const page = (params.page || 1) - 1
        return userService.getAll({ ...params, page: Math.max(0, page) })
      },
      placeholderData: (previousData) => previousData,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: USER_QUERY_KEYS.detail(id),
      queryFn: () => userService.getById(id),
    }),

  profile: () =>
    queryOptions({
      queryKey: USER_QUERY_KEYS.profile,
      queryFn: () => userService.getMyProfile(),
    }),

  publicProfile: (id: number) =>
    queryOptions({
      queryKey: USER_QUERY_KEYS.publicProfile(id),
      queryFn: () => userService.getUserPublicProfile(id),
    }),
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.update,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.detail(data.id) })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.delete,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
    },
  })
}

export const useBanUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.ban,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
    },
  })
}

export const useUnbanUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.unban,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.lists() })
    },
  })
}

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.editMyProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.profile })
    },
  })
}
