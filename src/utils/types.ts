export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  summary?: string;
  tags?: string[];
  sentiment?: string;
  event_date?: string;
  event_confidence?: string;
  event_reasoning?: string;
}

export interface NoteCreate {
  title: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  streaming?: boolean;
  status?: string;
  context?: { id: number; title: string }[];
  context_content?: string;
}

export interface AISummary {
  summary: string;
  tags: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
}

export type AIStreamState = {
  summary: string;
  tags: string[];
  sentiment: string;
  loading: boolean;
  streamingField: 'summary' | 'tags' | 'sentiment' | null;
};
