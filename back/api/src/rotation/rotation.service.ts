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
