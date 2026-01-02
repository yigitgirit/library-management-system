export const ErrorCodes = {
  // =====================================================================
  // 1. BUSINESS LOGIC - USER & GENERIC (E1xxx)
  // =====================================================================
  USER_NOT_FOUND: "E1001",
  EMAIL_ALREADY_EXISTS: "E1002",
  REFRESH_TOKEN_NOT_FOUND: "E1003",

  // =====================================================================
  // 2. AUTHENTICATION & SECURITY (E2xxx)
  // =====================================================================
  UNAUTHORIZED: "E2001",
  INVALID_CREDENTIALS: "E2002",
  FORBIDDEN: "E2003",
  TOKEN_EXPIRED: "E2004",
  REFRESH_TOKEN_EXPIRED: "E2005",
  USER_ACCOUNT_LOCKED: "E2006",

  // =====================================================================
  // 3. DATA & VALIDATION (E3xxx)
  // =====================================================================
  VALIDATION_ERROR: "E3001",
  MALFORMED_REQUEST: "E3002",
  INVALID_ARGUMENT_FORMAT: "E3003",
  ENDPOINT_NOT_FOUND: "E3004",
  RESOURCE_NOT_FOUND: "E3005",
  METHOD_NOT_SUPPORTED: "E3006",
  UNSUPPORTED_MEDIA_TYPE: "E3007",
  DATA_INTEGRITY_VIOLATION: "E3008",

  // =====================================================================
  // 4. BUSINESS LOGIC - LIBRARY DOMAIN (E4xxx)
  // =====================================================================
  AUTHOR_NOT_FOUND: "E4001",
  CATEGORY_NOT_FOUND: "E4002",
  BOOK_NOT_FOUND: "E4003",
  BOOK_ALREADY_EXISTS: "E4004",
  COPY_NOT_FOUND: "E4005",
  COPY_ALREADY_EXISTS: "E4006",
  COPY_NOT_AVAILABLE: "E4007",
  LOAN_STATUS_MODIFICATION_FORBIDDEN: "E4008",
  CATEGORY_ALREADY_EXISTS: "E4009",
  LOAN_ALREADY_EXISTS: "E4010",
  USER_LOAN_LIMIT_EXCEEDED: "E4011",
  USER_FINE_LIMIT_EXCEEDED: "E4012",
  LOAN_NOT_ACTIVE: "E4013",
  COPY_NOT_ON_LOAN: "E4014",
  FINE_ALREADY_PAID: "E4015",
  PAYMENT_AMOUNT_MISMATCH: "E4016",
  PAYMENT_PROCESSING_ERROR: "E4017",

  // =====================================================================
  // 5. GENERIC SYSTEM ERRORS (E5xxx)
  // =====================================================================
  INTERNAL_SERVER_ERROR: "E5000",
  NOT_IMPLEMENTED: "E5001",
  BOOK_PRICE_NOT_FOUND: "E5002",
} as const;

// TypeScript Type Inference (Otomatik tip tanımı)
export type ErrorCodeType = typeof ErrorCodes[keyof typeof ErrorCodes];
