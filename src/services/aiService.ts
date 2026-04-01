import { generateChatReply, UserInfo } from '@/services/chatLogic';
import { DailyPlan, NoteItem, TaskItem, UserMemory } from '@/types/assistant';

interface AssistantContext {
  input: string;
  userInfo: UserInfo;
  conversation: { type: 'user' | 'robot'; text: string }[];
  memory: UserMemory;
  tasks: TaskItem[];
  notes: NoteItem[];
  dailyPlan: DailyPlan;
}

export interface AssistantReply {
  text: string;
  updatedUserInfo: UserInfo;
}

const SYSTEM_PROMPT = `You are Robi, a helpful, concise, friendly personal assistant.
You help with reminders, notes, planning, and productivity.
Answer in 2-4 short sentences unless user asks for more detail.
If user shares personal preference or identity, acknowledge naturally.`;

const buildContextPrompt = (ctx: AssistantContext) => {
  const recentConversation = ctx.conversation
    .slice(-8)
    .map((item) => `${item.type === 'user' ? 'User' : 'Robi'}: ${item.text}`)
    .join('\n');

  return `
User profile: ${JSON.stringify(ctx.userInfo)}
Memory summary: ${ctx.memory.conversationSummary || 'No summary yet'}
Task count: ${ctx.tasks.length}, open tasks: ${ctx.tasks.filter((t) => !t.completed).length}
Notes count: ${ctx.notes.length}
Daily focus: ${ctx.dailyPlan.focus || 'not set'}
Recent chat:
${recentConversation || 'No recent conversation.'}
User message: ${ctx.input}
`.trim();
};

const fetchAiReply = async (ctx: AssistantContext): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const baseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';
  const model = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) return null;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildContextPrompt(ctx) }
        ]
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
};

export const getAssistantReply = async (ctx: AssistantContext): Promise<AssistantReply> => {
  const aiText = await fetchAiReply(ctx);
  if (aiText) {
    return { text: aiText, updatedUserInfo: ctx.userInfo };
  }

  const fallback = generateChatReply(ctx.input, ctx.userInfo);
  return { text: fallback.response, updatedUserInfo: fallback.userInfo };
};
