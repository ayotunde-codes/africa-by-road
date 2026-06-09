export interface ApiEnvelope<T> {
  message?: string
  data: T
}

export function unwrapData<T>(response: T | ApiEnvelope<T>) {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Object.keys(response as unknown as Record<string, unknown>).some((key) => key === "message" || key === "data")
  ) {
    return (response as ApiEnvelope<T>).data
  }

  return response as T
}
