"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEmbeddingModel = void 0;
exports.getExpectedEmbeddingDimensions = getExpectedEmbeddingDimensions;
exports.generateEmbedding = generateEmbedding;
const openai_1 = __importDefault(require("openai"));
// ---------------- CONFIG ----------------
function getOpenAIKey() {
    return process.env.GEMINI_API_KEY_2 || process.env.OPENAI_API_KEY || process.env.openAIKey || null;
}
exports.defaultEmbeddingModel = process.env.OPENAI_EMBED_MODEL ||
    (process.env.GEMINI_API_KEY_2 ? "gemini-embedding-001" : "text-embedding-3-small");
const embeddingDimensionsByModel = {
    "gemini-embedding-001": 3072,
    "text-embedding-3-small": 1536,
    "text-embedding-3-large": 3072,
};
function getExpectedEmbeddingDimensions(model = exports.defaultEmbeddingModel) {
    return embeddingDimensionsByModel[model] || 1536;
}
// ✅ Create client once
// const apiKey = getOpenAIKey();
// const client = apiKey ? new OpenAI({ apiKey }) : null;
// ✅ Create client once, pointing to Google's OpenAI-compatible endpoint
const apiKey = getOpenAIKey();
const client = apiKey ? new openai_1.default({
    apiKey: apiKey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" // The magic bridge!
}) : null;
// ---------------- SIMPLE CACHE ----------------
// key → embedding
const embeddingCache = new Map();
// Optional: limit cache size (avoid memory leak)
const MAX_CACHE_SIZE = 1000;
function setCache(key, value) {
    if (embeddingCache.size >= MAX_CACHE_SIZE) {
        // delete oldest entry (FIFO)
        const firstKey = embeddingCache.keys().next().value;
        if (firstKey)
            embeddingCache.delete(firstKey);
    }
    embeddingCache.set(key, value);
}
// ---------------- MAIN FUNCTION ----------------
function generateEmbedding(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (!client)
            return null;
        const text = (input || "").trim().toLowerCase();
        if (!text)
            return null;
        // ✅ Check cache first
        if (embeddingCache.has(text)) {
            return embeddingCache.get(text);
        }
        console.log("Generating embedding for:", text);
        try {
            const resp = yield client.embeddings.create({
                model: exports.defaultEmbeddingModel,
                input: text,
            });
            const vector = (_b = (_a = resp.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.embedding;
            console.log("Embedding generated:", vector);
            if (Array.isArray(vector)) {
                // ✅ Store in cache
                setCache(text, vector);
                return vector;
            }
            return null;
        }
        catch (err) {
            console.error("❌ Embedding error:", err);
            return null;
        }
    });
}
