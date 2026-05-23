import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // AI assistant routing
  app.post("/api/assistant", async (req, res) => {
    try {
      const { action, text, context } = req.body;
      const ai = getAIClient();

      let systemInstruction = "You are an expert career consultant, professional resume writer, and recruiter.";
      let prompt = "";

      if (action === "polish-summary") {
        prompt = `
You are a top-tier resume polisher. Improve the following resume professional summary/bio draft to sound highly polished, compelling, and executive-ready. 
Highlight strengths, remove words like "I" or "my" where appropriate (resume format uses third-person or verb-first implicit tense), and make it crisp.
Keep it between 3 to 5 sentences.

Guidelines:
- Return ONLY the final polished summary paragraph.
- DO NOT wrap in quotes.
- DO NOT say "Here is your summary:" or add any conversational intro/outro.

Draft summary:
"${text}"

Current role: ${context?.title ?? "Professional"}
Skills context: ${context?.skills ?? "Not specified"}
        `.trim();
      } else if (action === "polish-experience") {
        prompt = `
Optimize the following description or accomplishments of a job role into highly professional, metric-oriented, and impact-driven bullet points.
Start each bullet point with a strong, active action verb (e.g., Spearheaded, Engineered, Optimized, Delivered, Formulated, Championed).
If the input lacks concrete metrics, frame the achievements to highlight efficiency, scale, or business value where possible.

Guidelines:
- Return ONLY the professional bullet points, with each bullet starting with the "• " symbol.
- Return 2 to 4 bullet points.
- DO NOT say "Here are your bullet points" or add commentary.

Raw draft info:
"${text}"

Job Title: ${context?.title ?? "Role"}
Company: ${context?.company ?? "Organization"}
        `.trim();
      } else if (action === "suggest-skills") {
        prompt = `
Suggest 8-10 highly relevant skills, tech stack tags, or core competencies based on the job title and category.

Guidelines:
- Provide the output ONLY as a comma-separated list of short skills/technologies.
- DO NOT add numbers, headers, bullet points, or instructions.
- Example output format: React, TypeScript, Node.js, REST APIs, System Design, Git, Agile, AWS

Job Title: "${text}"
        `.trim();
      } else if (action === "tailor-job") {
        prompt = `
Analyze the target job description and the user's current summary/experience draft. Modify the draft so it is strategically tailored to fit the target job, emphasizing key keywords and matching criteria from the description while remaining realistic.

Guidelines:
- Tailor the summary/points to focus on matching keywords.
- Return ONLY the rewritten text (either summary paragraph or bullet points, matching the format of the draft).
- DO NOT add conversational preambles.

Target Job Description:
"${context?.jobDescription}"

Original Draft:
"${text}"
        `.trim();
      } else {
        return res.status(400).json({ error: "Invalid action type." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const outcome = response.text || "";
      res.json({ result: outcome.trim() });
    } catch (error: any) {
      console.error("Gemini API Error in backend:", error);
      res.status(500).json({ 
        error: error.message || "An error occurred with the AI assistant. Ensure GEMINI_API_KEY is configured." 
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
