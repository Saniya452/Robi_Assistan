import { Card } from '@/components/ui/card';
import { UserMemory } from '@/types/assistant';

interface MemoryPanelProps {
  memory: UserMemory;
}

const MemoryPanel = ({ memory }: MemoryPanelProps) => {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-semibold">Memory</h3>
      <div className="text-sm space-y-2">
        <p><span className="font-medium">Name:</span> {memory.profile.name || 'Unknown'}</p>
        <p>
          <span className="font-medium">Interests:</span>{' '}
          {memory.profile.interests?.length ? memory.profile.interests.join(', ') : 'None yet'}
        </p>
        <p>
          <span className="font-medium">Preferences:</span>{' '}
          {memory.preferences.length ? memory.preferences.join(', ') : 'None yet'}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Summary:</span>{' '}
          {memory.conversationSummary || 'Robi will summarize your recent conversation here.'}
        </p>
      </div>
    </Card>
  );
};

export default MemoryPanel;
