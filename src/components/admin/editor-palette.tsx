'use client';

import { Seat } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Armchair, Users, Milestone, Sun, Book, Coffee, DoorOpen, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';

export type BrushType = Seat['type'];

interface EditorPaletteProps {
  activeBrush: BrushType;
  onBrushSelect: (brush: BrushType) => void;
}

const seatTypes: { value: BrushType, label: string, icon: React.ReactNode, color: string }[] = [
    { value: 'seat', label: 'Single Seat', icon: <Armchair className="w-5 h-5" />, color: 'bg-green-200' },
    { value: 'group-seat', label: 'Group Seat', icon: <Users className="w-5 h-5" />, color: 'bg-blue-200' },
    { value: 'wall', label: 'Wall', icon: <Milestone className="w-5 h-5" />, color: 'bg-slate-400' },
    { value: 'window', label: 'Window', icon: <Sun className="w-5 h-5" />, color: 'bg-blue-100' },
    { value: 'book-shelf', label: 'Bookshelf', icon: <Book className="w-5 h-5" />, color: 'bg-orange-100' },
    { value: 'coffee-station', label: 'Coffee Station', icon: <Coffee className="w-5 h-5" />, color: 'bg-yellow-100' },
    { value: 'entrance', label: 'Entrance', icon: <DoorOpen className="w-5 h-5" />, color: 'bg-gray-300' },
    { value: 'space', label: 'Eraser / Space', icon: <Ban className="w-5 h-5" />, color: 'bg-gray-100/50' },
];

export default function EditorPalette({ activeBrush, onBrushSelect }: EditorPaletteProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Drawing Tools</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2">
        <ScrollArea className="h-full pr-3">
          <div className="grid grid-cols-2 gap-2">
            {seatTypes.map(item => (
              <Button
                key={item.value}
                variant="outline"
                onClick={() => onBrushSelect(item.value)}
                className={cn(
                  'h-20 flex-col gap-2',
                  activeBrush === item.value && 'ring-2 ring-primary border-primary'
                )}
                aria-label={`Select ${item.label} brush`}
              >
                <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", item.color)}>
                  {item.icon}
                </div>
                <span className="text-xs text-center">{item.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
