import { ConversationMessage, UserInfo } from '@/services/chatLogic';

export interface TaskItem {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface DailyPlan {
  focus: string;
  agenda: string[];
  assistantSuggestions: string[];
  updatedAt: number;
}

export interface UserMemory {
  profile: UserInfo;
  conversationSummary: string;
  preferences: string[];
  updatedAt: number;
}

export interface AssistantState {
  conversation: ConversationMessage[];
  memory: UserMemory;
  tasks: TaskItem[];
  notes: NoteItem[];
  dailyPlan: DailyPlan;
}
