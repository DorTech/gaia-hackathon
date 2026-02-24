import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { GenerateRotationDto } from "./dto/generate-rotation.dto";

@Injectable()
export class RotationService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>("OPENAI_API_KEY"),
    });
  }

  async generate(dto: GenerateRotationDto): Promise<Record<string, any>> {
    const systemPrompt = `You are an agricultural expert. Generate a JSON object describing a crop rotation plan. Take a close care to the crop growth duration and period to ensure the rotation is realistic and coherent.

The JSON MUST follow this exact schema:
{
  "title": "string - title of the rotation",
  "options": {
    "view": "horizontal",
    "show_transcript": true,
    "title_top_interventions": "Cultures principales",
    "title_bottom_interventions": "Couverts et CIVE",
    "title_steps": "Rotation",
    "region": "string - region name",
    "show_climate_diagram": true,
    "climate_data": {
      "temperatures": [12 monthly average temperatures in Celsius],
      "precipitations": [12 monthly precipitation values in mm]
    }
  },
  "steps": [
    {
      "startDate": "ISO 8601 date string e.g. 2026-03-01T00:00:00.000Z",
      "id": "UUID v4",
      "name": "string - crop name",
      "color": "hex color string",
      "endDate": "ISO 8601 date string",
      "description": "string - detailed description with yields, techniques, etc.",
      "interventions": [
        {
          "id": "UUID v4",
          "day": "string - number of days relative to step start date (can be negative)",
          "name": "string - intervention name",
          "type": "intervention_top or intervention_bottom",
          "description": "string"
        }
      ],
      "attributes": [
        {
          "id": "UUID v4",
          "name": "string - attribute name",
          "value": "string - attribute value"
        }
      ],
      "secondary_crop": boolean,
      "useDefaultColor": false,
      "useDefaultStartDate": false,
      "useDefaultEndDate": false,
      "duration": number (approximate months)
    }
  ]
}

Rules:
- Use "intervention_top" for main crop interventions, "intervention_bottom" for cover/secondary crop interventions
- Steps should be chronologically ordered with no gaps
- Use realistic French agricultural terms when the user writes in French
- The "day" field in interventions is a string representing days relative to the step's startDate (can be negative for pre-sowing work)
- secondary_crop should be true for cover crops and CIVEs
- Colors: use earth tones (#d2b48c) for cereals, greens (#2d9f6e, #4caf50) for legumes/forage, gold (#ffd700) for oilseeds, light blue (#a7c6ed) for cover crops, grey (#d6d6d6) for secondary crops
- Generate valid UUID v4 for all id fields
- Climate data should be realistic for the specified region (12 values, one per month Jan-Dec)
- Crop duration constraints (MUST be respected):
- Maïs grain: 5-7 months (April-October)
- Maïs ensilage: 4-6 months
- Blé tendre d’hiver: 9-11 months
- Orge de printemps: 4-5 months
- Colza: 10-11 months
- Couverts végétaux / CIVE: 2-5 months
- For every step:
- duration (months) MUST match the difference between startDate and endDate (±1 month tolerance)
- If duration exceeds the realistic maximum for the crop, the response is INVALID
- Do NOT extend a crop beyond its biological growth cycle to avoid gaps. Use cover crops or fallow periods instead.

If a period longer than the crop duration is needed, insert a secondary crop or cover crop step instead of extending the main crop.

Additionally, you MUST include a "diagnostic_variables" key in the JSON output. This extracts ONLY information that the user EXPLICITLY stated in their prompt.

"diagnostic_variables": {
  "departement": number | null,
  "sdc_type_agriculture": string | null,
  "nb_cultures_rotation": number | null,
  "sequence_cultures": string | null,
  "recours_macroorganismes": string | null,
  "nbre_de_passages_desherbage_meca": number | null,
  "type_de_travail_du_sol": string | null,
  "ferti_n_tot": number | null
}

STRICT RULES for diagnostic_variables — you MUST follow these exactly:
- "departement": Only fill if the user EXPLICITLY names a department, city, or region. Map to the department number (e.g. "Loire" → 42, "Bretagne" → 35, "Beauce" → 28). If no location is mentioned, return null.
- "sdc_type_agriculture": Only fill if the user EXPLICITLY mentions agriculture type (e.g. "conventionnel", "bio", "agriculture de conservation"). Return the keyword the user used (e.g. "conventionnel", "biologique", "conservation", "raisonnée"). If not mentioned, return null.
- "nb_cultures_rotation": Count ONLY the main crops the user EXPLICITLY listed. Do NOT count cover crops or CIVEs you invented. If the user says "blé et maïs", that is 2.
- "sequence_cultures": Build the sequence ONLY from crops the user EXPLICITLY named, in the order they mentioned them. Format: "Crop1 > Crop2". Use French names.
- "recours_macroorganismes": Only fill ("Oui" or "Non") if the user EXPLICITLY mentions macroorganisms, trichogrammes, or biological control. Otherwise null.
- "nbre_de_passages_desherbage_meca": Only fill if the user EXPLICITLY mentions a number of mechanical weeding passes. Otherwise null.
- "type_de_travail_du_sol": Only fill if the user EXPLICITLY mentions soil work type (labour, TCS, semis direct, sans travail du sol). Value must be one of: "Aucun", "Labour", "TCS", "Semis direct". Otherwise null.
- "ferti_n_tot": Only fill if the user EXPLICITLY mentions a nitrogen fertilization amount in kg/ha. Otherwise null.

CRITICAL: Do NOT infer, guess, or assume any diagnostic variable that the user did not EXPLICITLY write. When in doubt, return null. A variable should be null unless the user's exact words clearly provide that information.

- Return ONLY the JSON object, no other text`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: dto.prompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new InternalServerErrorException(
          "OpenAI returned an empty response",
        );
      }

      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new InternalServerErrorException("OpenAI returned invalid JSON");
      }
      throw error;
    }
  }
}
