import OpenAI from "openai";
import dotenv from "dotenv";
import { ITrip } from "../entities/trip.entity";
import { ITripRepository } from "../interfaces/repositories/ITrip.repository";
import { IAiUsecase, TripChatLocation } from "../interfaces/usecase/IAi.usecase";
import { searchTripIdsByText } from "../frameworks/utils/tripVectorStore";

dotenv.config();

// ---------------- CONFIG ----------------

function getOpenAIKey() {
  return process.env.OPENAI_API_KEY || process.env.openAIKey || null;
}

const chatModel = process.env.OPENAI_CHAT_MODEL || "gpt-4o";

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

async function rapidApiChat(prompt: string): Promise<string | null> {
  const key = getRapidApiKey();
  if (!key) return null;

  try {
    const url = new URL(
      "https://free-chatgpt-api.p.rapidapi.com/chat-completion-one"
    );
    url.searchParams.set("prompt", prompt);

    const resp = await fetch(url.toString(), {
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

    const data: any = await resp.json();

    return (
      data?.choices?.[0]?.message?.content ||
      data?.reply ||
      data?.text ||
      null
    );
  } catch (err) {
    console.error("❌ RapidAPI Error:", err);
    return null;
  }
}

// ---------------- MAIN USECASE ----------------

export class AiUsecase implements IAiUsecase {
  constructor(private tripRepository: ITripRepository) {}

  async tripChat(
    message: string,
    location?: TripChatLocation
  ): Promise<{ reply: string; trips: ITrip[] }> {
    const userMessage = (message || "").trim();

    if (!userMessage) {
      return {
        reply: "Please tell me what kind of trip you're looking for.",
        trips: [],
      };
    }

    // ---------------- VECTOR SEARCH ----------------
    let trips: ITrip[] = [];

    try {
      let ids = await searchTripIdsByText(userMessage, 8, location);

      if (ids.length === 0 && location?.lat !== undefined && location?.lng !== undefined) {
        ids = await searchTripIdsByText(userMessage, 8);
      }

      if (ids?.length) {
        const dbTrips = await this.tripRepository.findByIds(ids);
        const tripMap = new Map(dbTrips.map((trip) => [String(trip._id), trip]));

        trips = ids
          .map((id) => tripMap.get(id))
          .filter(Boolean) as ITrip[];
      }
    } catch (err) {
      console.error("Vector search error:", err);
      trips = [];
    }

    // ---------------- CONTEXT ----------------
    const context =
      trips.length === 0
        ? "No matching trips found."
        : `Available trips:\n\n${trips
            .map((t, idx) => {
              return `${idx + 1}.
tripId: ${t._id}
title: ${t.title}
from: ${t.startingPoint?.name}
to: ${t.destination?.name}
description: ${(t.description || "").slice(0, 180)}
tags: ${t.tags?.join(", ") || "none"}`;
            })
            .join("\n\n")}`;

    // ---------------- PROMPT ----------------
    const userPrompt = `
${context}

User request: ${userMessage}
`;

    // ---------------- OPENAI ----------------
    const apiKey = getOpenAIKey();

    if (apiKey) {
      try {
        const client = new OpenAI({ apiKey });

        const resp = await client.chat.completions.create({
          model: chatModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
        });

        const reply =
          resp.choices?.[0]?.message?.content?.trim() ||
          "I couldn’t generate a reply right now.";

        return { reply, trips };
      } catch (err) {
        console.error("OpenAI Error:", err);
      }
    }

    // ---------------- FALLBACK ----------------
    const rapidReply = await rapidApiChat(userPrompt);

    if (rapidReply) {
      return { reply: rapidReply, trips };
    }

    return {
      reply:
        "AI search is temporarily unavailable. Try refining your query.",
      trips,
    };
  }
}
