import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthUser } from "@/lib/jwt";
import { rateLimit } from "@/lib/rate-limit";

interface EvalRequest {
  patternSlug: string;
  userPrompt: string;
  testCaseId: string;
  testInput: string;
  expectedBehavior: string;
  rubric: string[];
}

const GRADING_SYSTEM_PROMPT = `You are an expert prompt engineering grader. You evaluate whether a student's system prompt, when given a specific test input, would produce output that meets the expected behavior.

You will receive:
1. The student's system prompt
2. A test input (simulated user message)
3. The expected behavior criteria
4. A grading rubric

Your job:
- Simulate what the student's prompt would produce when given the test input
- Evaluate whether that simulated output meets the expected behavior
- Score from 0 to 100
- Provide specific, actionable feedback

Respond ONLY with valid JSON in this exact format:
{"passed": true/false, "score": 0-100, "feedback": "specific feedback about what the prompt does well or poorly", "outputPreview": "a brief preview of what the prompt would likely produce"}`;

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
    }

    const limiter = rateLimit(`prompt-eval:${auth.userId}`, { maxRequests: 20, windowMs: 60 * 60 * 1000 });
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, message: "Rate limit exceeded. Try again later." },
        { status: 429 },
      );
    }

    const body: EvalRequest = await request.json();
    const { userPrompt, testInput, expectedBehavior, rubric } = body;

    if (!userPrompt || !expectedBehavior) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const userMessage = `## Student's System Prompt
${userPrompt}

## Test Input (user message to the agent)
${testInput || "(empty input)"}

## Expected Behavior
${expectedBehavior}

## Grading Rubric
${rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}

Evaluate the student's prompt and respond with the JSON grading.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent({
      systemInstruction: GRADING_SYSTEM_PROMPT,
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
    });

    const text = result.response.text();
    const evaluation = JSON.parse(text);

    return NextResponse.json({
      success: true,
      passed: evaluation.passed ?? false,
      score: evaluation.score ?? 0,
      feedback: evaluation.feedback ?? "No feedback generated.",
      outputPreview: evaluation.outputPreview ?? "",
    });
  } catch (error) {
    console.error("Prompt evaluate error:", error);
    return NextResponse.json(
      { success: false, message: "Evaluation failed. Please try again." },
      { status: 500 },
    );
  }
}
