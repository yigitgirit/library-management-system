import { apiClient } from "@/lib/api-client"
import { DashboardOverview } from "../types/dashboard"

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await apiClient.get<{ data: DashboardOverview }>("/api/management/dashboard/overview")
    return response.data.data
  },
}
