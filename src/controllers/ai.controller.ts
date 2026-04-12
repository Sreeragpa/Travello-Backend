import { NextFunction, Request, Response } from 'express';
import { IAIUsecase } from '../interfaces/usecase/IAi.usecase';
import session from 'express-session';

interface SessionRequest extends Request {
  session: session.Session & Partial<SessionData>;
}
 interface SessionData {
    chatHistory?: any[];
  }

export default class AIController {
  constructor(private aiUsecase: IAIUsecase) {}

  async grokChat(req: SessionRequest, res: Response, next: NextFunction) {
    const { message } = req.body;

    try {
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing message in request body' });
      }

      // Initialize session history if not present
      if (!req.session.chatHistory) {
        req.session.chatHistory = [];
      }

      // Add user message to history
      req.session.chatHistory.push({ role: 'user', content: message });

      // Generate response using conversation history
      const response = await this.aiUsecase.executeGrokChat(req.session.chatHistory);

      // Add assistant response to history
      req.session.chatHistory.push({ role: 'assistant', content: response });

      // Limit history to 10 messages to prevent excessive growth
      if (req.session.chatHistory.length > 10) {
        req.session.chatHistory = req.session.chatHistory.slice(-10);
      }

      res.json({ response });
    } catch (error) {
      console.error('Error in grokChat:', error);
      res.status(500).json({ error: 'AI chat failed', details: (error as Error).message });
    }
  }

  async structuredGrokChat(req: Request, res: Response, next: NextFunction) {
    const { message, systemPrompt } = req.body;

    try {
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing message in request body' });
      }

      const response = await this.aiUsecase.executeStructuredGrokChat(message, systemPrompt);
      res.json(response);
    } catch (error) {
      console.error('Error in structuredGrokChat:', error);
      res.status(500).json({ error: 'Structured AI chat failed', details: (error as Error).message });
    }
  }
}