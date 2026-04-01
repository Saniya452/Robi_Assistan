import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskItem } from '@/types/assistant';

interface TaskPanelProps {
  tasks: TaskItem[];
  onAddTask: (title: string, priority: TaskItem['priority']) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskPanel = ({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskPanelProps) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');

  const submitTask = () => {
    if (!title.trim()) return;
    onAddTask(title, priority);
    setTitle('');
    setPriority('medium');
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Tasks</h3>
      <div className="space-y-2">
        <Input
          placeholder="Add a task..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && submitTask()}
        />
        <div className="flex items-center gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskItem['priority'])}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Button onClick={submitTask} className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks yet.</p>}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2 rounded-md border p-2">
            <Button size="icon" variant={task.completed ? 'default' : 'outline'} onClick={() => onToggleTask(task.id)}>
              <Check className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
            </div>
            <Badge variant="secondary">{task.priority}</Badge>
            <Button size="icon" variant="ghost" onClick={() => onDeleteTask(task.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TaskPanel;
