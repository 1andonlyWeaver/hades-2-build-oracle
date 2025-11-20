
import { GoogleGenAI } from "@google/genai";
import { BuildGuide } from '../types';
import { BOON_DATABASE } from '../boonData';
import { HAMMER_DATABASE } from '../hammerData';
import { WEAPONS } from '../constants';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBuildGuide = async (
  weaponName: string, 
  aspectName: string, 
  avoidBuild?: BuildGuide,
  pinnedBoons?: Partial<BuildGuide['boons']>,
  pinnedHammers?: BuildGuide['hammers'],
  pinnedDuos?: BuildGuide['duos']
): Promise<BuildGuide> => {
  // Using gemini-2.5-flash for fast, context-aware generation
  const modelId = 'gemini-2.5-flash';

  let context = "";

  const hasPinnedBoons = pinnedBoons && Object.keys(pinnedBoons).length > 0;
  const hasPinnedHammers = pinnedHammers && pinnedHammers.length > 0;
  const hasPinnedDuos = pinnedDuos && pinnedDuos.length > 0;

  if (hasPinnedBoons || hasPinnedHammers || hasPinnedDuos) {
    context += `
    CRITICAL CONSTRAINT - LOCKED ITEMS:
    The user has explicitly pinned the following items. You MUST include these EXACT recommendations in the final JSON.
    `;

    if (hasPinnedBoons) {
      context += `\nLOCKED BOONS (Must be in their specific slots):\n`;
      Object.entries(pinnedBoons!).forEach(([slot, boon]) => {
        if (boon) {
          context += `- ${slot}: ${boon.god} - ${boon.boonName} (${boon.rarity || 'Common'})\n`;
        }
      });
    }

    if (hasPinnedHammers) {
      context += `\nLOCKED HAMMERS (Must be included in the "hammers" array):\n`;
      pinnedHammers!.forEach(h => {
        context += `- ${h.name}\n`;
      });
    }

    if (hasPinnedDuos) {
      context += `\nLOCKED SYNERGIES (Must be included in the "duos" array):\n`;
      pinnedDuos!.forEach(d => {
        context += `- ${d.boonName}\n`;
      });
    }
  }

  if (avoidBuild) {
    context += `
    CONTEXT - PREVIOUS RECOMMENDATION:
    Previous Style: ${avoidBuild.playstyle}
    The user requested a "New Strategy". Create a DIFFERENT build strategy (except for the locked items above).
    `;
  }

  // Identify Weapon ID to fetch relevant Hammers
  const weapon = WEAPONS.find(w => w.name === weaponName);
  const weaponId = weapon?.id;
  const relevantHammers = weaponId ? HAMMER_DATABASE[weaponId] : [];

  // Convert data to string representation
  const boonContext = JSON.stringify(BOON_DATABASE);
  const hammerContext = JSON.stringify(relevantHammers);

  const prompt = `
    You are an expert Hades II buildcrafter.
    The user has selected the weapon "${weaponName}" with the "${aspectName}".
    
    SOURCE OF TRUTH (OLYMPIAN BOONS):
    ${boonContext}

    SOURCE OF TRUTH (DAEDALUS HAMMERS for ${weaponName}):
    ${hammerContext}

    ${context}

    YOUR TASK:
    Create a highly synergistic build guide for this aspect using ONLY the boons and hammers listed in the SOURCES OF TRUTH above.
    Do not invent boons or hammers.
    
    CRITICAL INSTRUCTIONS:
    1. **STRICT SELECTION**: For the slots (Attack, Special, Cast, Sprint, Magick), you must select a boon from the OLYMPIAN BOONS database.
    2. **SPRINT SLOT**: Do NOT recommend Hermes boons for the "Sprint" slot. Use a core Olympian (Apollo, Hestia, Poseidon, etc.) that applies a status effect or damage.
    3. **HAMMERS**: Select 2-3 Daedalus Hammer upgrades exclusively from the DAEDALUS HAMMERS list provided above.
    4. **STATS**: Use the effect description from the database in the 'description' field.
    5. **EXPLANATIONS**: For every recommendation (Boons, Hammers, Duos), the 'explanation' field MUST provide deep strategic reasoning. Explain WHY it works specifically with the ${aspectName}, how it interacts with the weapon's moveset, and how it synergizes with the other chosen boons/hammers. Avoid generic descriptions.
    
    REQUIRED OUTPUT SECTIONS:
    1. Playstyle summary.
    2. Best-in-slot recommendations for Attack, Special, Cast, Sprint, Magick.
    3. 2-3 Daedalus Hammer upgrades.
    4. 1-3 Duo boons or Passive boons from the database. IMPORTANT: For Duos/Synergies, strictly follow the JSON format below, providing the 'boonName', 'gods' (array of god names), 'description', and 'explanation'.

    OUTPUT FORMAT:
    Return ONLY a valid JSON object matching this structure:
    {
      "aspectName": "string",
      "playstyle": "string",
      "boons": {
        "attack": { "slot": "Attack", "god": "string", "boonName": "string", "description": "string", "explanation": "string", "rarity": "Common" },
        "special": { "slot": "Special", "god": "string", "boonName": "string", "description": "string", "explanation": "string", "rarity": "Common" },
        "cast": { "slot": "Cast", "god": "string", "boonName": "string", "description": "string", "explanation": "string", "rarity": "Common" },
        "sprint": { "slot": "Sprint", "god": "string", "boonName": "string", "description": "string", "explanation": "string", "rarity": "Common" },
        "magick": { "slot": "Magick Gain", "god": "string", "boonName": "string", "description": "string", "explanation": "string", "rarity": "Common" }
      },
      "hammers": [
        { "name": "string", "description": "string", "synergy": "string (Explanation of why this hammer is chosen)" }
      ],
      "duos": [
        { "boonName": "string", "gods": ["string", "string"], "description": "string (The in-game effect)", "explanation": "string (Strategic reasoning/Synergy)" }
      ],
      "sources": []
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    let jsonString = text.trim();
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonString = jsonMatch[1];
    } else if (text.includes('{') && text.includes('}')) {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}') + 1;
        jsonString = text.substring(start, end);
    }

    let guide: BuildGuide;
    try {
      guide = JSON.parse(jsonString);
    } catch (e) {
      console.error("JSON Parse Error", e);
      throw new Error("Failed to parse build guide data.");
    }

    guide.sources = [{ title: "Hades II Wiki (Local DB)", uri: "https://hades.fandom.com/wiki/Hades_II" }];
    
    return guide;

  } catch (error) {
    console.error("Error fetching build guide:", error);
    throw new Error("Failed to generate guide. Please try again.");
  }
};
