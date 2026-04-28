import OpenAI from "openai";

// ---------------- CONFIG ----------------

function getOpenAIKey() {
  return process.env.openAIKey || process.env.OPENAI_API_KEY || null;
}

const defaultEmbeddingModel =
  process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";

// ✅ Create client once
const apiKey = getOpenAIKey();
const client = apiKey ? new OpenAI({ apiKey }) : null;

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

  try {
    const resp = await client.embeddings.create({
      model: defaultEmbeddingModel,
      input: text,
    });

    const vector = resp.data?.[0]?.embedding;

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
