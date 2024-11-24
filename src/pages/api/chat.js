// pages/api/chat.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { user_query } = req.body;

    if (!user_query || !Array.isArray(user_query)) {
      return res.status(400).json({ error: "Invalid user query provided" });
    }

    try {
      // OpenAI Chat Completion API call
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",   // Or "gpt-4o-mini"
        messages: user_query,
        temperature: 0.7,
      });

      const chatResponse = response.choices[0].message.content;

      return res.status(200).json({ response: chatResponse });
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}