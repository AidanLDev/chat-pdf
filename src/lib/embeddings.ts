import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbeddings(text: string) {
  try {
    const res = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });

    const result = res;
    return result.data[0].embedding as number[];
  } catch (error) {
    console.error("error calling openapi embedding api: ", error);
    throw error;
  }
}
