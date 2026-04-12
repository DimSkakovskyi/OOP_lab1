type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong'
): string {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}