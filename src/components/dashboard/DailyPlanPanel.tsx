import { Lightbulb, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DailyPlan } from '@/types/assistant';

interface DailyPlanPanelProps {
  dailyPlan: DailyPlan;
  onUpdateFocus: (focus: string) => void;
  onGenerateSuggestions: () => void;
}

const DailyPlanPanel = ({ dailyPlan, onUpdateFocus, onGenerateSuggestions }: DailyPlanPanelProps) => {
  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-lg font-semibold">Daily Plan</h3>
      <div className="space-y-2">
        <label className="text-sm font-medium">Today focus</label>
        <Input
          placeholder="What is your main focus today?"
          value={dailyPlan.focus}
          onChange={(event) => onUpdateFocus(event.target.value)}
        />
      </div>
      <Button onClick={onGenerateSuggestions} className="w-full">
        <Lightbulb className="w-4 h-4 mr-2" />
        Generate Suggestions
      </Button>
      <div className="space-y-2">
        <p className="text-sm font-medium flex items-center gap-2"><Target className="w-4 h-4" /> Suggestions</p>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
          {dailyPlan.assistantSuggestions.length === 0 && <li>No suggestions yet.</li>}
          {dailyPlan.assistantSuggestions.map((item, idx) => (
            <li key={`${item}-${idx}`}>{item}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default DailyPlanPanel;
