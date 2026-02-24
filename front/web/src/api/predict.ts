import axios from 'axios';
import type { ITKFormState } from '../store/diagnosticAtoms';
import { CHIP_API_VALUES } from '../store/diagnosticAtoms';

const mlClient = axios.create({ baseURL: '/ml' });

interface PredictResponse {
  ift_histo_chimique_tot: number;
}

export async function predictIFT(form: ITKFormState, agricultureTypes: string[]): Promise<number> {
  const payload = {
    nb_cultures_rotation: form.nbCulturesRotation,
    sequence_cultures: form.sequenceCultures,
    recours_macroorganismes: CHIP_API_VALUES.recoursMacroorganismes[form.recoursMacroorganismes] ?? 'Non',
    nbre_de_passages_desherbage_meca: form.nbrePassagesDesherbageMeca,
    type_de_travail_du_sol: CHIP_API_VALUES.typeTravailDuSol[form.typeTravailDuSol] ?? 'Labour',
    departement: form.departement,
    sdc_type_agriculture: agricultureTypes[form.sdcTypeAgriculture] ?? 'Agriculture conventionnelle',
    ferti_n_tot: form.fertiNTot,
  };

  const { data } = await mlClient.post<PredictResponse>('/predict', payload);
  return data.ift_histo_chimique_tot;
}
