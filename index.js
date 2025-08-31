import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const askAi = async (prompt) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
          You are a network troubleshooting assistant.  
          Your task is to analyze a given network problem based on the provided input and return a structured response in JSON.  

          ### Input Format (Request)
          {
            "symptom": string,                // Main issue description (e.g., "Slow internet on multiple devices")
            "conditions": string[],           // Context or environment (e.g., ["Happens only at night", "WiFi only"])
            "keywords": string[]              // Technical hints or related terms (e.g., ["DNS", "router", "packet loss"])
          }

          ### Output Format (Response)
          {
            "id": string,                     // Unique identifier (UUID or random string)
            "category": string,               // General type of issue (e.g., "DNS Issue", "Bandwidth Saturation", "WiFi Interference")
            "diagnosis": string,              // Clear explanation of the likely root cause
            "solution": string[]              // List of step-by-step solutions or best practices
          }

          ### Instructions
          - Always output valid JSON.
          - Use the inputs to infer the most likely category and diagnosis.
          - Provide practical, actionable solutions that a network engineer or IT support person could apply.
          - Keep explanations clear and concise, without unnecessary technical jargon.
          - If the problem cannot be fully diagnosed, suggest the most probable cause and next steps.

          ### Example

          **Request:**
          {
            "symptom": "Frequent disconnections from WiFi",
            "conditions": ["Only on laptops", "Signal strength is strong"],
            "keywords": ["driver", "authentication", "router logs"]
          }

          **Response:**
          {
            "id": "case-48f2b9",
            "category": "WiFi Authentication Issue",
            "diagnosis": "The problem is likely caused by outdated or corrupted WiFi drivers on the laptops, since the signal strength is good and the issue is device-specific.",
            "solution": [
              "Update WiFi drivers on affected laptops.",
              "Check router logs for authentication failures.",
              "Forget and re-add the WiFi network on the laptops.",
              "Ensure WPA2/WPA3 settings are compatible."
            ]
          }
        `,
      },
      {
        role: "user",
        content: JSON.stringify({
          prompt,
        }),
      },
    ],
    temperature: 0.2,
  });
  return response.choices[0].message.content;
};

app.post("/api/chat", async (request, response) => {
  const { prompt } = request.body;
  const reply = await askAi(prompt);
  response.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
