import OpenAI from "openai";

// ---------------- CONFIG ----------------

function getOpenAIKey() {
  return process.env.GEMINI_API_KEY_2 || process.env.OPENAI_API_KEY || process.env.openAIKey || null;
}

export const defaultEmbeddingModel =
  process.env.OPENAI_EMBED_MODEL ||
  (process.env.GEMINI_API_KEY_2 ? "gemini-embedding-001" : "text-embedding-3-small");

const embeddingDimensionsByModel: Record<string, number> = {
  "gemini-embedding-001": 3072,
  "text-embedding-3-small": 1536,
  "text-embedding-3-large": 3072,
};

export function getExpectedEmbeddingDimensions(model = defaultEmbeddingModel): number {
  return embeddingDimensionsByModel[model] || 1536;
}

// ✅ Create client once
// const apiKey = getOpenAIKey();
// const client = apiKey ? new OpenAI({ apiKey }) : null;
// ✅ Create client once, pointing to Google's OpenAI-compatible endpoint
const apiKey = getOpenAIKey();
const client = apiKey ? new OpenAI({ 
  apiKey: apiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" // The magic bridge!
}) : null;

// ---------------- SIMPLE CACHE ----------------

// key → embedding
const embeddingCache = new Map<string, number[]>();

// Optional: limit cache size (avoid memory leak)
const MAX_CACHE_SIZE = 1000;

function setCache(key: string, value: number[]) {
  if (embeddingCache.size >= MAX_CACHE_SIZE) {
    // delete oldest entry (FIFO)
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey) embeddingCache.delete(firstKey);
  }
  embeddingCache.set(key, value);
}

// ---------------- MAIN FUNCTION ----------------

export async function generateEmbedding(
  input: string
): Promise<number[] | null> {
  if (!client) return null;

  const text = (input || "").trim().toLowerCase();
  if (!text) return null;

  // ✅ Check cache first
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }
  console.log("Generating embedding for:", text);

  try {
    const resp = await client.embeddings.create({
      model: defaultEmbeddingModel,
      input: text,
    });

    const vector = resp.data?.[0]?.embedding;
    console.log("Embedding generated:", vector);

    if (Array.isArray(vector)) {
      // ✅ Store in cache
      setCache(text, vector);
      return vector;
    }

    return null;
  } catch (err) {
    console.error("❌ Embedding error:", err);
    return null;
  }
}
