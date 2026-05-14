export type AiUtilizationProvider = "skipped" | "gemini" | "rapidapi" | "none";

/** Fields stored per AI invocation (trip chat, etc.) */
export interface IAiUtilizationRecord {
  user?: string;
  feature: string;
  provider: AiUtilizationProvider;
  model?: string;
  messageCharCount: number;
  replyCharCount: number;
  tripsReturnedCount: number;
  hadLocationFilter: boolean;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  durationMs: number;
  errorSummary?: string;
}
