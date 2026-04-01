import { AssistantState, DailyPlan, NoteItem, TaskItem, UserMemory } from '@/types/assistant';

const STORAGE_KEY = 'robi_assistant_state_v1';

const defaultMemory = (): UserMemory => ({
  profile: {},
  conversationSummary: '',
  preferences: [],
  updatedAt: Date.now()
});

const defaultDailyPlan = (): DailyPlan => ({
  focus: '',
  agenda: [],
  assistantSuggestions: [],
  updatedAt: Date.now()
});

export const defaultAssistantState = (): AssistantState => ({
  conversation: [],
  memory: defaultMemory(),
  tasks: [],
  notes: [],
  dailyPlan: defaultDailyPlan()
});

export const loadAssistantState = (): AssistantState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAssistantState();
    const parsed = JSON.parse(raw) as Partial<AssistantState>;
    return {
      conversation: parsed.conversation || [],
      memory: parsed.memory || defaultMemory(),
      tasks: parsed.tasks || [],
      notes: parsed.notes || [],
      dailyPlan: parsed.dailyPlan || defaultDailyPlan()
    };
  } catch {
    return defaultAssistantState();
  }
};

export const saveAssistantState = (state: AssistantState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const summarizeConversation = (messages: { type: 'user' | 'robot'; text: string }[]) => {
  const recent = messages.slice(-6);
  if (!recent.length) return '';
  return recent.map((msg) => `${msg.type === 'user' ? 'User' : 'Robi'}: ${msg.text}`).join(' | ');
};

export const createTask = (title: string, priority: TaskItem['priority'] = 'medium'): TaskItem => ({
  id: crypto.randomUUID(),
  title: title.trim(),
  priority,
  completed: false,
  createdAt: Date.now()
});

export const createNote = (title: string, content: string): NoteItem => ({
  id: crypto.randomUUID(),
  title: title.trim() || 'Untitled',
  content,
  createdAt: Date.now(),
  updatedAt: Date.now()
});
