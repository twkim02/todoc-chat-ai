
import { useState, ReactNode } from 'react';
import {
  Bot,
  TrendingUp,
  Heart,
  Moon,
  Utensils,
  Baby,
  Smile,
  Sparkles,
  ArrowLeft,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Button, buttonVariants } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { toast } from 'sonner';
import { cn } from './ui/utils';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { VariantProps } from 'class-variance-authority';

// --- MOCK DATA & TYPES ---
interface JournalEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  timestamp: string;
  date: Date;
}

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    category: 'meal',
    title: 'First solid food!',
    content: 'Tried rice cereal for the first time. A bit strange for the little one, but ate half of it. So proud!',
    timestamp: 'November 8, 2025',
    date: new Date(2025, 10, 8),
  },
  {
    id: '2',
    category: 'sleep',
    title: 'Slept 5 hours straight!',
    content: 'Finally slept for 5 hours straight through the night. Mom and Dad are crying tears of joy... 😭',
    timestamp: 'November 7, 2025',
    date: new Date(2025, 10, 7),
  },
];

const recordCategories = [
  { id: 'growth', label: 'Growth', icon: <TrendingUp className="h-5 w-5" />, color: 'var(--primary)' },
  { id: 'sleep', label: 'Sleep', icon: <Moon className="h-5 w-5" />, color: 'var(--accent)' },
  { id: 'meal', label: 'Meal', icon: <Utensils className="h-5 w-5" />, color: 'var(--secondary)' },
  { id: 'health', label: 'Health', icon: <Heart className="h-5 w-5" />, color: 'var(--destructive)' },
  { id: 'development', label: 'Development', icon: <Baby className="h-5 w-5" />, color: 'var(--primary)' },
  { id: 'emotion', label: 'Emotion', icon: <Smile className="h-5 w-5" />, color: 'var(--emotion)' },
];

const getCategory = (id: string) => recordCategories.find(cat => cat.id === id);

// --- SUB-COMPONENTS ---

const JournalEntryCard = ({ entry }: { entry: JournalEntry }) => {
  const categoryInfo = getCategory(entry.category);
  if (!categoryInfo) return null;

  return (
    <Card className="w-full overflow-hidden" style={{ borderLeft: `4px solid ${categoryInfo.color}` }}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm" style={{ color: categoryInfo.color }}>
          {categoryInfo.icon}
          <span className="font-medium">{categoryInfo.label}</span>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-1">{entry.title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{entry.content}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
          <CalendarIcon className="h-3 w-3" />
          <span>{entry.timestamp}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const JournalForm = ({ categoryId, onSave, onBack }) => {
  const categoryInfo = getCategory(categoryId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());

  if (!categoryInfo) return null;

  const handleSave = () => {
    if (!title || !content || !date) {
      toast.error('Please fill in the title, content, and date.');
      return;
    }
    onSave({
      category: categoryId,
      title,
      content,
      date,
    });
  };

  const getButtonVariant = (catId: string): VariantProps<typeof buttonVariants>['variant'] => {
    switch (catId) {
      case 'health':
        return 'destructive';
      case 'meal':
        return 'secondary';
      case 'sleep':
        return 'accent';
      case 'emotion':
        return 'emotion';
      case 'growth':
      case 'development':
      default:
        return 'default';
    }
  };

  return (
    <div className="h-full w-full overflow-auto bg-background text-foreground p-4">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold" style={{ color: categoryInfo.color }}>
          New {categoryInfo.label} Entry
        </h2>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="date" className="text-sm font-medium mb-2 block">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: enUS }) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={enUS}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label htmlFor="title" className="text-sm font-medium mb-2 block">Title</label>
          <Input
            id="title"
            placeholder="Enter a title for the entry"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-muted-foreground/20"
          />
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium mb-2 block">Content</label>
          <Textarea
            id="content"
            placeholder="Write down today's special moments..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] border-muted-foreground/20"
          />
        </div>
        <Button
          onClick={handleSave}
          className={cn(
            "w-full",
            categoryId === 'emotion' && "bg-black text-white hover:bg-gray-800"
          )}
          variant={getButtonVariant(categoryId)}
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function RecordScreen() {
  const [view, setView] = useState<{ screen: 'list' | 'form'; categoryId: string | null }>({ screen: 'list', categoryId: null });
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);

  const handleSaveEntry = (newEntryData: { category: string; title: string; content: string; date: Date }) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: format(newEntryData.date, 'PPP', { locale: enUS }),
      ...newEntryData,
    };
    setEntries([newEntry, ...entries]);
    toast.success(`New ${getCategory(newEntry.category)?.label} entry has been saved.`);
    setView({ screen: 'list', categoryId: null });
  };

  if (view.screen === 'form' && view.categoryId) {
    return (
      <JournalForm
        categoryId={view.categoryId}
        onSave={handleSaveEntry}
        onBack={() => setView({ screen: 'list', categoryId: null })}
      />
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-background text-foreground p-4 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-primary">Baby's Journal</h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          {entries.length > 0 ? (
            entries.map(entry => <JournalEntryCard key={entry.id} entry={entry} />)
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No entries yet.</p>
              <p className="text-muted-foreground text-sm">Add your first entry from the categories below!</p>
            </div>
          )}
        </div>

        <div className="pt-6">
          <h2 className="font-medium text-muted-foreground mb-3">Add New Entry</h2>
          <div className="grid grid-cols-3 gap-3">
            {recordCategories.map((cat) => (
              <Card
                key={cat.id}
                className="flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setView({ screen: 'form', categoryId: cat.id })}
              >
                <div className="mb-2" style={{ color: cat.color }}>{cat.icon}</div>
                <p className="text-xs font-medium">{cat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 right-4 flex flex-col gap-3 z-10">
        <Drawer open={isAiSheetOpen} onOpenChange={setIsAiSheetOpen}>
          <DrawerTrigger asChild>
            <Button size="icon" className="rounded-full h-14 w-14 bg-gradient-to-br from-primary to-accent shadow-lg">
              <Bot className="h-7 w-7 text-white" />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Assistant
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <p className="text-muted-foreground text-sm">The AI Assistant feature is coming soon.</p>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
