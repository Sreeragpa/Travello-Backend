import OpenAI from "openai";
import { portfolioData } from "../../data/portfolioData";

export interface IGrokService {
  generateResponse(
    messages: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string>;
  generateStructuredResponse(
    input: string,
    systemPrompt?: string
  ): Promise<any>;
}

export class GrokService implements IGrokService {
  private openai: OpenAI;
  private apiKey: string;
  // private model: string = 'grok-3';
  private model: string = "gpt-4o-mini";
  private baseUrl: string = "https://api.x.ai/v1";
  private portfolioSystemPrompt: string;

  constructor() {
    // this.apiKey = process.env.XAI_API_KEY!;
    this.apiKey = process.env.openAIKey!;
    if (!this.apiKey) {
      throw new Error("XAI_API_KEY environment variable is not set");
    }
    this.openai = new OpenAI({ apiKey: this.apiKey });

    this.portfolioSystemPrompt = `
      You are an AI assistant representing ${
        portfolioData.name
      }. Provide accurate and professional responses based on the following information:
      - Bio: ${portfolioData.profileSummary}
      - Skills: Frontend - ${portfolioData.skills.frontend.join(
        ", "
      )}; Backend - ${portfolioData.skills.backend.join(
      ", "
    )}; DevOps - ${portfolioData.skills.devops.join(
      ", "
    )}; Other - ${portfolioData.skills.other.join(", ")}
      - Projects: ${portfolioData.personalProjects
        .map((p) => `${p.name}: ${p.description}`)
        .join("; ")}
      - Experience: ${portfolioData.experience
        .map((e) => `${e.role} at ${e.company} (${e.duration})`)
        .join("; ")}
      - Achievements: ${portfolioData.achievements.join("; ")}
      - Contact: Email - ${portfolioData.contact.email}, LinkedIn - ${
      portfolioData.contact.linkedin
    }
      Answer questions about ${
        portfolioData.name
      } based on this data. For unrelated questions, respond helpfully but concisely.
    `;
  }

  private async makeApiRequest(endpoint: string, body: any): Promise<any> {
    try {
      // const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(body),
      // });

      // if (!response.ok) {
      //   throw new Error(`API request failed: ${response.statusText}`);
      // }

      // return await response.json();


      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: body?.messages,
      });

      return completion;
    } catch (error) {
      console.error(`Error in API request to ${endpoint}:`, error);
      throw new Error(`Failed to make API request to ${endpoint}`);
    }
  }

  async generateResponse(
    messages: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string> {
    try {
      const fullMessages = [
        { role: "system", content: this.portfolioSystemPrompt },
        ...messages,
      ];

      const body = {
        model: this.model,
        messages: fullMessages,
      };

      const result = await this.makeApiRequest("chat/completions", body);
      return result.choices[0].message.content;
    } catch (error) {
      console.error("Error generating response from Grok:", error);
      throw new Error("Failed to generate response from Grok API");
    }
  }

  async generateStructuredResponse(
    input: string,
    systemPrompt?: string
  ): Promise<any> {
    try {
      const content = systemPrompt
        ? `${systemPrompt}\n\nUser input: ${input}`
        : input;

      const fullMessages = [
        { role: "system", content: this.portfolioSystemPrompt },
        {
          role: "user",
          content: `${content}\n\nPlease respond in valid JSON format.`,
        },
      ];

      const body = {
        model: this.model,
        messages: fullMessages,
      };

      const result = await this.makeApiRequest("chat/completions", body);
      const text = result.choices[0].message.content;

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.warn("Failed to parse JSON response:", text);
        return { response: text };
      }
    } catch (error) {
      console.error("Error generating structured response from Grok:", error);
      throw new Error("Failed to generate structured response from Grok API");
    }
  }
}

let grokServiceInstance: GrokService | null = null;

export const getGrokService = (): GrokService => {
  if (!grokServiceInstance) {
    grokServiceInstance = new GrokService();
  }
  return grokServiceInstance;
};
