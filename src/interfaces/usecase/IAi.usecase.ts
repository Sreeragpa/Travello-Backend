export interface IAIUsecase {
  executeGrokChat(messages: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string>;
  executeStructuredGrokChat(input: string, systemPrompt?: string): Promise<any>;
}