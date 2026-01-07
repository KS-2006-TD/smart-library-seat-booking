'use client';

import { Seat } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Armchair, Users, Trash2, Milestone, Sun, Book, Coffee, DoorOpen, Ban } from 'lucide-react';
import { useEffect } from 'react';

interface EditorPaletteProps {
  selectedSeat: Seat | null;
  onUpdateSeat: (updatedSeat: Partial<Seat>) => void;
}

const seatTypes: { value: Seat['type'], label: string, icon: React.ReactNode }[] = [
    { value: 'space', label: 'Empty Space', icon: <Ban className="w-4 h-4" /> },
    { value: 'seat', label: 'Single Seat', icon: <Armchair className="w-4 h-4" /> },
    { value: 'group-seat', label: 'Group Seat', icon: <Users className="w-4 h-4" /> },
    { value: 'wall', label: 'Wall', icon: <Milestone className="w-4 h-4" /> },
    { value: 'window', label: 'Window', icon: <Sun className="w-4 h-4" /> },
    { value: 'book-shelf', label: 'Bookshelf', icon: <Book className="w-4 h-4" /> },
    { value: 'coffee-station', label: 'Coffee Station', icon: <Coffee className="w-4 h-4" /> },
    { value: 'entrance', label: 'Entrance', icon: <DoorOpen className="w-4 h-4" /> },
];

export default function EditorPalette({ selectedSeat, onUpdateSeat }: EditorPaletteProps) {

  const handleTypeChange = (type: Seat['type']) => {
    const isSeat = ['seat', 'group-seat'].includes(type);
    onUpdateSeat({ type, label: isSeat ? selectedSeat?.label || '' : '' });
  }
  
  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSeat({ label: e.target.value });
  }

  const handleClearLabel = () => {
    onUpdateSeat({ label: '' });
  }


  if (!selectedSeat) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Floor Plan Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Select a cell on the grid to start editing its properties.</p>
        </CardContent>
      </Card>
    );
  }

  const isSeat = ['seat', 'group-seat'].includes(selectedSeat.type);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Edit Cell</CardTitle>
        <CardDescription>Cell ID: {selectedSeat.id}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label>Cell Type</Label>
            <Select value={selectedSeat.type} onValueChange={(value: Seat['type']) => handleTypeChange(value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select cell type" />
                </SelectTrigger>
                <SelectContent>
                    {seatTypes.map(item => (
                        <SelectItem key={item.value} value={item.value}>
                           <div className="flex items-center gap-2">
                             {item.icon}
                             <span>{item.label}</span>
                           </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {isSeat && (
            <div className="space-y-2">
                <Label htmlFor="seat-label">Seat Label</Label>
                <div className="flex items-center gap-2">
                    <Input id="seat-label" value={selectedSeat.label || ''} onChange={handleLabelChange} placeholder="e.g. A12" />
                    <Button variant="ghost" size="icon" onClick={handleClearLabel} aria-label="Clear label">
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground">Give this seat a unique identifier.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
