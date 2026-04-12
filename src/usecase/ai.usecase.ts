
import { IGrokService } from "../frameworks/utils/geminiService";
import { IAIUsecase } from "../interfaces/usecase/IAi.usecase";

export class AIUsecase implements IAIUsecase {
  constructor(private grokService: IGrokService) {}

  async executeGrokChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> {
    try {
      return await this.grokService.generateResponse(messages);
    } catch (error) {
      console.error('Error executing Grok chat:', error);
      throw new Error('Failed to process AI chat request');
    }
  }

  async executeStructuredGrokChat(input: string, systemPrompt?: string): Promise<any> {
    try {
      return await this.grokService.generateStructuredResponse(input, systemPrompt);
    } catch (error) {
      console.error('Error executing structured Grok chat:', error);
      throw new Error('Failed to process structured AI chat request');
    }
  }
}