import OpenAI from "openai";

console.log("API Key:", process.env.OPENAI_API_KEY);  // Log the API key for debugging

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { user_query } = req.body;

    console.log("Incoming user query:", user_query);  // Log incoming query

    if (!user_query || !Array.isArray(user_query)) {
      console.error("Invalid user query:", user_query);
      return res.status(400).json({ error: "Invalid user query provided" });
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: user_query,
        temperature: 0.7,
      });

      console.log("OpenAI Response:", response);  // Log OpenAI response for debugging

      const chatResponse = response.choices[0].message.content;
      return res.status(200).json({ response: chatResponse });
    } catch (error) {
      console.error("Error with OpenAI API:", error);
      console.error("Error details:", error.response ? error.response.data : error.message);
      return res.status(500).json({
        error: "Something went wrong with the OpenAI API.",
        message: error.message,
        stack: error.stack,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}