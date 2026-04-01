import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, Mic, MicOff, RotateCcw, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import RobotFace from './RobotFace';
import { useVoiceController } from '@/hooks/useVoiceController';
import { useToast } from '@/hooks/use-toast';
import {
  ConversationMessage,
  RobotExpression,
  RobotMood,
  UserInfo,
  generateChatReply,
  getInitialGreeting,
  getResponseExpression
} from '@/services/chatLogic';
import { getAssistantReply } from '@/services/aiService';
import {
  createNote,
  createTask,
  defaultAssistantState,
  loadAssistantState,
  saveAssistantState,
  summarizeConversation
} from '@/lib/memory';
import { DailyPlan, NoteItem, TaskItem, UserMemory } from '@/types/assistant';
import TaskPanel from '@/components/tasks/TaskPanel';
import NotesPanel from '@/components/notes/NotesPanel';
import MemoryPanel from '@/components/dashboard/MemoryPanel';
import DailyPlanPanel from '@/components/dashboard/DailyPlanPanel';

type ActiveSection = 'chat' | 'tasks' | 'notes' | 'memory' | 'planning';

const RobotCompanion: React.FC = () => {
  const [expression, setExpression] = useState<RobotExpression>('idle');
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [mood, setMood] = useState<RobotMood>('excited');
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [memory, setMemory] = useState<UserMemory>(defaultAssistantState().memory);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(defaultAssistantState().dailyPlan);
  const [activeSection, setActiveSection] = useState<ActiveSection>('chat');
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const { toast } = useToast();

  const {
    isListening,
    isSpeaking,
    toggleListening,
    stopListening,
    stopSpeaking,
    speak,
    isSupported,
    microphonePermission,
    requestMicrophonePermission
  } = useVoiceController({
    onSpeechRecognized: handleSpeechRecognized,
    onListeningChange: (listening) => {
      if (listening) {
        stopSpeaking();
        setExpression('listening');
      } else if (!isSpeaking) {
        setExpression('idle');
      }
    },
    onSpeakingChange: (speaking) => {
      if (speaking) {
        stopListening();
        setExpression('speaking');
      } else if (!isListening) {
        setTimeout(() => setExpression('idle'), 500);
      }
    }
  });

  useEffect(() => {
    const stored = loadAssistantState();
    setConversation(stored.conversation);
    setUserInfo(stored.memory.profile || {});
    setMemory(stored.memory);
    setTasks(stored.tasks);
    setNotes(stored.notes);
    setDailyPlan(stored.dailyPlan);
    if (stored.conversation.length > 0) {
      setHasGreeted(true);
    }
  }, []);

  useEffect(() => {
    saveAssistantState({
      conversation,
      memory: {
        ...memory,
        profile: userInfo,
        conversationSummary: summarizeConversation(conversation),
        updatedAt: Date.now()
      },
      tasks,
      notes,
      dailyPlan
    });
  }, [conversation, memory, userInfo, tasks, notes, dailyPlan]);

  useEffect(() => {
    if (!hasGreeted && isSupported && conversation.length === 0) {
      setTimeout(() => {
        const greeting = getInitialGreeting();
        setExpression('happy');
        setConversation([{ type: 'robot', text: greeting }]);
        setHasGreeted(true);
      }, 1000);
    }
  }, [isSupported, hasGreeted, conversation.length]);

  const runAssistant = async (text: string) => {
    if (!text.trim()) return;
    stopListening();
    setConversation((prev) => [...prev, { type: 'user', text }]);
    setExpression('thinking');
    setIsProcessing(true);

    const fallback = generateChatReply(text, userInfo);
    const aiReply = await getAssistantReply({
      input: text,
      userInfo,
      conversation,
      memory,
      tasks,
      notes,
      dailyPlan
    });

    const response = aiReply.text || fallback.response;
    setUserInfo(aiReply.updatedUserInfo || fallback.userInfo);
    setMood(fallback.mood);
    setConversation((prev) => [...prev, { type: 'robot', text: response }]);
    setExpression(getResponseExpression(fallback.mood, response));
    speak(response);
    setIsProcessing(false);
  };

  function handleSpeechRecognized(text: string) {
    runAssistant(text);
  }

  const handleTextSubmit = async () => {
    const text = textInput.trim();
    if (!text) return;
    setTextInput('');
    await runAssistant(text);
  };

  const resetConversation = () => {
    setConversation([]);
    setExpression('idle');
    setMood('excited');
    setUserInfo({});
    setMemory(defaultAssistantState().memory);
    setTasks([]);
    setNotes([]);
    setDailyPlan(defaultAssistantState().dailyPlan);
    setHasGreeted(false);
    toast({
      title: "New Chat Started!",
      description: "Robi is ready for a fresh conversation!"
    });
  };

  const handleRobotClick = () => {
    if (!isSpeaking && !isListening && !isProcessing) {
      setExpression('happy');
      setTimeout(() => setExpression('idle'), 900);
    }
  };

  const pendingTaskCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  const addTask = (title: string, priority: TaskItem['priority']) => {
    setTasks((prev) => [createTask(title, priority), ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const addNote = (title: string, content: string) => {
    setNotes((prev) => [createNote(title, content), ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note, title: title || note.title, content, updatedAt: Date.now() } : note))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const updateDailyFocus = (focus: string) => {
    setDailyPlan((prev) => ({ ...prev, focus, updatedAt: Date.now() }));
  };

  const generateDailySuggestions = () => {
    const suggestions = [
      dailyPlan.focus ? `Spend your first 45 minutes on: ${dailyPlan.focus}` : 'Set one clear focus for today.',
      pendingTaskCount > 0 ? `Complete one high-priority task first (${pendingTaskCount} pending).` : 'Add one meaningful task for today.',
      notes.length > 0 ? 'Review your latest note before ending the day.' : 'Capture at least one key idea in Notes.',
      'Leave 15 minutes for review and planning tomorrow.'
    ];
    setDailyPlan((prev) => ({ ...prev, assistantSuggestions: suggestions, updatedAt: Date.now() }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-4">
        <Card className="p-4 space-y-3 h-fit">
          <h2 className="text-xl font-bold">Robi Assistant</h2>
          <p className="text-sm text-muted-foreground">Smart personal assistant dashboard</p>
          <div className="space-y-2">
            <Button variant={activeSection === 'chat' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveSection('chat')}>Chat</Button>
            <Button variant={activeSection === 'tasks' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveSection('tasks')}>Tasks</Button>
            <Button variant={activeSection === 'notes' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveSection('notes')}>Notes</Button>
            <Button variant={activeSection === 'memory' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveSection('memory')}>Memory</Button>
            <Button variant={activeSection === 'planning' ? 'default' : 'outline'} className="w-full" onClick={() => setActiveSection('planning')}>Planning</Button>
          </div>
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Pending tasks: {pendingTaskCount}</p>
            <p className="text-sm text-muted-foreground">Notes: {notes.length}</p>
          </div>
        </Card>

        <Card className="p-4 space-y-4 min-h-[80vh]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Meet Robi</h1>
              <p className="text-sm text-muted-foreground">
                Voice + text assistant for productivity
                {userInfo.name && <span className="block mt-1">Currently helping: {userInfo.name}</span>}
              </p>
            </div>
            <div className="cursor-pointer" onClick={handleRobotClick}>
              <RobotFace expression={expression} isAnimating={isSpeaking || isProcessing} />
            </div>
          </div>

          {activeSection === 'chat' && (
            <>
              <div className="flex-1 min-h-0 space-y-3 max-h-[52vh] overflow-y-auto pr-1">
                {conversation.length === 0 && (
                  <p className="text-sm text-muted-foreground">Start by typing or speaking to Robi.</p>
                )}
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.type === 'user' ? 'bg-blue-100 ml-12' : 'bg-purple-100 mr-12'
                    }`}
                  >
                    <div className="font-semibold text-xs text-gray-600 mb-1">
                      {message.type === 'user' ? `You` : 'Robi'}
                    </div>
                    <div className="text-sm">{message.text}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={textInput}
                    onChange={(event) => setTextInput(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleTextSubmit()}
                    disabled={isProcessing}
                  />
                  <Button onClick={handleTextSubmit} disabled={isProcessing || !textInput.trim()}>
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={toggleListening} disabled={!isSupported || isSpeaking || isProcessing}>
                    {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isListening ? 'Stop Listening' : 'Start Talking'}
                  </Button>
                  <Button onClick={resetConversation} variant="outline">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>

                {microphonePermission !== 'granted' && isSupported && (
                  <div className="text-sm text-amber-700">
                    {microphonePermission === 'denied' && 'Microphone blocked. Allow it in browser settings.'}
                    {microphonePermission === 'insecure' && 'Microphone requires localhost or HTTPS.'}
                    {microphonePermission === 'unsupported' && 'This browser cannot request microphone access.'}
                    {microphonePermission === 'idle' && 'Voice chat needs microphone permission.'}
                    {(microphonePermission === 'idle' || microphonePermission === 'denied') && (
                      <Button onClick={requestMicrophonePermission} variant="secondary" className="ml-2">
                        Allow Mic
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === 'tasks' && (
            <TaskPanel tasks={tasks} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
          )}
          {activeSection === 'notes' && (
            <NotesPanel notes={notes} onAddNote={addNote} onUpdateNote={updateNote} onDeleteNote={deleteNote} />
          )}
          {activeSection === 'memory' && <MemoryPanel memory={memory} />}
          {activeSection === 'planning' && (
            <DailyPlanPanel
              dailyPlan={dailyPlan}
              onUpdateFocus={updateDailyFocus}
              onGenerateSuggestions={generateDailySuggestions}
            />
          )}
        </Card>

        <div className="space-y-4">
          <MemoryPanel memory={{ ...memory, profile: userInfo, conversationSummary: summarizeConversation(conversation) }} />
          <TaskPanel tasks={tasks.slice(0, 4)} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />
          <Card className="p-4">
            <h3 className="text-base font-semibold mb-2">Recent Notes</h3>
            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <div key={note.id} className="border rounded-md p-2">
                  <p className="text-sm font-medium">{note.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{note.content || 'No content'}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RobotCompanion;
