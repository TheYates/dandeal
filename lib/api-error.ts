import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  timestamp: string;
  path?: string;
}

/**
 * Handle API errors and return standardized error response
 */
export function handleApiError(
  error: unknown,
  path?: string
): NextResponse<ApiErrorResponse> {
  console.error("API Error:", error);

  // Handle custom ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
        path,
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 500 }
    );
  }

  // Handle unknown errors
  return NextResponse.json(
    {
      error: "Internal server error",
      timestamp: new Date().toISOString(),
      path,
    },
    { status: 500 }
  );
}

/**
 * Common API errors
 */
export const API_ERRORS = {
  UNAUTHORIZED: new ApiError(401, "Unauthorized", "UNAUTHORIZED"),
  FORBIDDEN: new ApiError(403, "Access denied", "FORBIDDEN"),
  NOT_FOUND: new ApiError(404, "Resource not found", "NOT_FOUND"),
  BAD_REQUEST: new ApiError(400, "Bad request", "BAD_REQUEST"),
  RATE_LIMIT: new ApiError(429, "Too many requests", "RATE_LIMIT"),
  INTERNAL_ERROR: new ApiError(500, "Internal server error", "INTERNAL_ERROR"),
} as const;

/**
 * Validation error helper
 */
export function validationError(
  field: string,
  message: string
): ApiError {
  return new ApiError(400, `${field}: ${message}`, "VALIDATION_ERROR");
}

