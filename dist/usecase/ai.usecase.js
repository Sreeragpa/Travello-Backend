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
exports.AiUsecase = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
const tripVectorStore_1 = require("../frameworks/utils/tripVectorStore");
dotenv_1.default.config();
// ---------------- CONFIG ----------------
function getOpenAIKey() {
    return process.env.GEMINI_API_KEY_2 || null;
    return process.env.OPENAI_API_KEY || process.env.openAIKey || null;
}
// const chatModel = process.env.OPENAI_CHAT_MODEL || "gpt-4o";
const chatModel = "gemini-2.5-flash";
const SYSTEM_PROMPT = `
You are Travello's AI travel assistant.

Rules:
- Recommend ONLY from the provided trips.
- NEVER invent trips.
- If no trips match, clearly say so and suggest refining the query.
- Keep answers short, friendly, and useful.
- Highlight why each trip matches the user's request.
- If needed, ask 1 short follow-up question.

Format:
- Use bullet points for trips.
- Mention title and why it matches.
`;
// ---------------- RAPID API ----------------
function getRapidApiKey() {
    return process.env.RAPIDAPI_KEY || null;
}
function rapidApiChat(prompt) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const key = getRapidApiKey();
        if (!key)
            return null;
        try {
            const url = new URL("https://free-chatgpt-api.p.rapidapi.com/chat-completion-one");
            url.searchParams.set("prompt", prompt);
            const resp = yield fetch(url.toString(), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-rapidapi-host": "free-chatgpt-api.p.rapidapi.com",
                    "x-rapidapi-key": key,
                },
            });
            if (!resp.ok) {
                console.error("❌ RapidAPI failed:", resp.status);
                return null;
            }
            const data = yield resp.json();
            return (((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) ||
                (data === null || data === void 0 ? void 0 : data.reply) ||
                (data === null || data === void 0 ? void 0 : data.text) ||
                null);
        }
        catch (err) {
            console.error("❌ RapidAPI Error:", err);
            return null;
        }
    });
}
// ---------------- MAIN USECASE ----------------
class AiUsecase {
    constructor(tripRepository, aiUtilizationRepository) {
        this.tripRepository = tripRepository;
        this.aiUtilizationRepository = aiUtilizationRepository;
    }
    logTripChat(startedAt, userMessage, location, result, tripChatContext, meta) {
        const hadLocationFilter = (location === null || location === void 0 ? void 0 : location.lat) !== undefined &&
            (location === null || location === void 0 ? void 0 : location.lng) !== undefined &&
            Number.isFinite(location.lat) &&
            Number.isFinite(location.lng);
        const payload = {
            user: tripChatContext === null || tripChatContext === void 0 ? void 0 : tripChatContext.userId,
            feature: "trip_chat",
            provider: meta.provider,
            model: meta.model,
            messageCharCount: userMessage.length,
            replyCharCount: result.reply.length,
            tripsReturnedCount: result.trips.length,
            hadLocationFilter,
            promptTokens: meta.promptTokens,
            completionTokens: meta.completionTokens,
            totalTokens: meta.totalTokens,
            durationMs: Date.now() - startedAt,
            errorSummary: meta.errorSummary,
        };
        void this.aiUtilizationRepository
            .record(payload)
            .catch((e) => console.error("AI utilization log failed:", e));
    }
    tripChat(message, location, tripChatContext) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const startedAt = Date.now();
            const userMessage = (message || "").trim();
            if (!userMessage) {
                const result = {
                    reply: "Please tell me what kind of trip you're looking for.",
                    trips: [],
                };
                this.logTripChat(startedAt, userMessage, location, result, tripChatContext, {
                    provider: "skipped",
                });
                return result;
            }
            // ---------------- VECTOR SEARCH ----------------
            let trips = [];
            try {
                let ids = yield (0, tripVectorStore_1.searchTripIdsByText)(userMessage, 8, location);
                if (ids.length === 0 && (location === null || location === void 0 ? void 0 : location.lat) !== undefined && (location === null || location === void 0 ? void 0 : location.lng) !== undefined) {
                    ids = yield (0, tripVectorStore_1.searchTripIdsByText)(userMessage, 8);
                }
                if (ids === null || ids === void 0 ? void 0 : ids.length) {
                    const dbTrips = yield this.tripRepository.findByIds(ids);
                    const tripMap = new Map(dbTrips.map((trip) => [String(trip._id), trip]));
                    trips = ids
                        .map((id) => tripMap.get(id))
                        .filter(Boolean);
                }
            }
            catch (err) {
                console.error("Vector search error:", err);
                trips = [];
            }
            // ---------------- TRIP RAG CONTEXT ----------------
            const tripsContext = trips.length === 0
                ? "No matching trips found."
                : `Available trips:\n\n${trips
                    .map((t, idx) => {
                    var _a, _b, _c;
                    return `${idx + 1}.
tripId: ${t._id}
title: ${t.title}
from: ${(_a = t.startingPoint) === null || _a === void 0 ? void 0 : _a.name}
to: ${(_b = t.destination) === null || _b === void 0 ? void 0 : _b.name}
description: ${(t.description || "").slice(0, 180)}
tags: ${((_c = t.tags) === null || _c === void 0 ? void 0 : _c.join(", ")) || "none"}`;
                })
                    .join("\n\n")}`;
            // ---------------- PROMPT ----------------
            const userPrompt = `
${tripsContext}

User request: ${userMessage}
`;
            // ---------------- OPENAI ----------------
            const apiKey = getOpenAIKey();
            if (apiKey) {
                try {
                    // const client = new OpenAI({ apiKey });
                    const client = new openai_1.default({
                        apiKey: apiKey,
                        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" // The magic bridge!
                    });
                    const resp = yield client.chat.completions.create({
                        model: chatModel,
                        messages: [
                            { role: "system", content: SYSTEM_PROMPT },
                            { role: "user", content: userPrompt },
                        ],
                        temperature: 0.3,
                    });
                    const reply = ((_d = (_c = (_b = (_a = resp.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.trim()) ||
                        "I couldn’t generate a reply right now.";
                    const result = { reply, trips };
                    this.logTripChat(startedAt, userMessage, location, result, tripChatContext, {
                        provider: "gemini",
                        model: chatModel,
                        promptTokens: (_e = resp.usage) === null || _e === void 0 ? void 0 : _e.prompt_tokens,
                        completionTokens: (_f = resp.usage) === null || _f === void 0 ? void 0 : _f.completion_tokens,
                        totalTokens: (_g = resp.usage) === null || _g === void 0 ? void 0 : _g.total_tokens,
                    });
                    return result;
                }
                catch (err) {
                    console.error("OpenAI Error:", err);
                }
            }
            // ---------------- FALLBACK ----------------
            const rapidReply = yield rapidApiChat(userPrompt);
            if (rapidReply) {
                const result = { reply: rapidReply, trips };
                this.logTripChat(startedAt, userMessage, location, result, tripChatContext, {
                    provider: "rapidapi",
                });
                return result;
            }
            const result = {
                reply: "AI search is temporarily unavailable. Try refining your query.",
                trips,
            };
            this.logTripChat(startedAt, userMessage, location, result, tripChatContext, {
                provider: "none",
            });
            return result;
        });
    }
}
exports.AiUsecase = AiUsecase;
