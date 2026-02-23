import { apiClient } from "./client";

export interface GenerateRotationRequest {
  prompt: string;
}

export async function generateRotation(
  dto: GenerateRotationRequest,
): Promise<Record<string, unknown>> {
  const { data } = await apiClient.post<Record<string, unknown>>(
    "/rotation/generate",
    dto,
  );
  return data;
}
