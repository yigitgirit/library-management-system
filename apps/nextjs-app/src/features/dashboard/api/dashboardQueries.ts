import { queryOptions } from "@tanstack/react-query"
import { DASHBOARD_QUERY_KEYS } from "./query-keys"
import { dashboardService } from "../services/dashboardService"

export const dashboardQueries = {
  overview: () =>
    queryOptions({
      queryKey: DASHBOARD_QUERY_KEYS.overview(),
      queryFn: () => dashboardService.getOverview(),
    }),
}
