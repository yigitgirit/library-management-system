import { serverApiClient } from "./api-client/server-client"
import { browserClient } from "./api-client/browser-client"

// Export the correct client based on the environment
export const apiClient = typeof window === 'undefined' ? serverApiClient : browserClient
