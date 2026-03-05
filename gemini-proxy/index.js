import { createServer } from "node:http";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = process.env.PORT || 3001;
const API_SECRET = process.env.API_SECRET || "";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(GEMINI_KEY);

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-secret");
  if (req.method === "OPTIONS") return json(res, 204, {});

  if (req.method !== "POST" || req.url !== "/assess") {
    return json(res, 404, { error: "Not found" });
  }

  // Auth check
  if (req.headers["x-api-secret"] !== API_SECRET) {
    return json(res, 401, { error: "Unauthorized" });
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString());

    const { systemPrompt, userMessage } = body;
    if (!systemPrompt || !userMessage) {
      return json(res, 400, { error: "Missing systemPrompt or userMessage" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-preview-05-06",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const result = await model.generateContent({
      systemInstruction: systemPrompt,
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const text = result.response.text();
    const parsed = JSON.parse(text);

    return json(res, 200, { success: true, result: parsed });
  } catch (err) {
    console.error("Gemini error:", err.message);
    return json(res, 500, { error: "Assessment generation failed" });
  }
});

server.listen(PORT, () => {
  console.log(`Gemini proxy running on :${PORT}`);
});
