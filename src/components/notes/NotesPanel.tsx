import { useState } from 'react';
import { Edit, Plus, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NoteItem } from '@/types/assistant';

interface NotesPanelProps {
  notes: NoteItem[];
  onAddNote: (title: string, content: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

const NotesPanel = ({ notes, onAddNote, onUpdateNote, onDeleteNote }: NotesPanelProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const submitNote = () => {
    if (!title.trim() && !content.trim()) return;
    onAddNote(title, content);
    setTitle('');
    setContent('');
  };

  const startEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const saveEdit = () => {
    if (!editingId) return;
    onUpdateNote(editingId, title, content);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Notes</h3>
      <div className="space-y-2">
        <Input placeholder="Note title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <Textarea placeholder="Write your note..." value={content} onChange={(event) => setContent(event.target.value)} />
        <Button onClick={editingId ? saveEdit : submitNote} className="w-full">
          {editingId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {editingId ? 'Save Changes' : 'Add Note'}
        </Button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notes.length === 0 && <p className="text-sm text-muted-foreground">No notes saved.</p>}
        {notes.map((note) => (
          <div key={note.id} className="rounded-md border p-3 space-y-2">
            <p className="font-medium text-sm">{note.title}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content || 'No content'}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(note)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDeleteNote(note.id)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NotesPanel;
