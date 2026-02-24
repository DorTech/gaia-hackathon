import { apiClient } from "./client";

export interface GenerateRotationRequest {
  prompt: string;
}

export interface DiagnosticVariables {
  departement: number | null;
  sdc_type_agriculture: string | null;
  nb_cultures_rotation: number | null;
  sequence_cultures: string | null;
  recours_macroorganismes: string | null;
  nbre_de_passages_desherbage_meca: number | null;
  type_de_travail_du_sol: string | null;
  ferti_n_tot: number | null;
}

export interface GenerateRotationResponse {
  diagnostic_variables?: DiagnosticVariables;
  [key: string]: unknown;
}

export async function generateRotation(
  dto: GenerateRotationRequest,
): Promise<GenerateRotationResponse> {
  const { data } = await apiClient.post<GenerateRotationResponse>(
    "/rotation/generate",
    dto,
  );
  return data;
}
