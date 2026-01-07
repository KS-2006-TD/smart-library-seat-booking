'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { libraries, Seat, Floor } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditorPalette from '@/components/admin/editor-palette';

function EditableSeat({ seat, onClick, isSelected }: { seat: Seat, onClick: (seat: Seat) => void, isSelected: boolean }) {
  const seatTypeIcons: { [key in Seat['type']]: React.ReactNode } = {
    seat: <div className="w-full h-full bg-green-200 rounded-sm" />,
    'group-seat': <div className="w-full h-full bg-blue-200 rounded-sm" />,
    wall: <div className="w-full h-full bg-slate-400 rounded-sm" />,
    window: <div className="w-full h-full bg-blue-100 rounded-sm" />,
    'book-shelf': <div className="w-full h-full bg-orange-100 rounded-sm" />,
    'coffee-station': <div className="w-full h-full bg-yellow-100 rounded-sm" />,
    entrance: <div className="w-full h-full bg-gray-300 rounded-sm" />,
    space: <div className="w-full h-full bg-gray-100/50" />,
  };

  return (
    <button
      onClick={() => onClick(seat)}
      className={cn(
        'aspect-square rounded-sm p-0.5 transition-all duration-150 relative flex items-center justify-center border-2',
        isSelected ? 'border-primary ring-2 ring-primary' : 'border-transparent',
        'hover:border-primary/50'
      )}
      aria-label={`Grid cell ${seat.id}, Type: ${seat.type}`}
    >
      {seatTypeIcons[seat.type]}
      {seat.label && <span className="absolute text-[7px] font-bold text-black/60 pointer-events-none">{seat.label}</span>}
    </button>
  );
}

export default function FloorEditorPage({ params }: { params: { libraryId: string, floorId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentParams] = useState(params);

  const [floorData, setFloorData] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lib = libraries.find(l => l.id === currentParams.libraryId);
    const floor = lib?.floors.find(f => f.id === currentParams.floorId) ?? null;
    setFloorData(floor);
    setLoading(false);
  }, [currentParams]);

  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };
  
  const updateSeat = (updatedSeat: Partial<Seat>) => {
    if (!selectedSeat) return;

    const newSeatData: Seat = { ...selectedSeat, ...updatedSeat };
    setSelectedSeat(newSeatData);

    setFloorData(prevFloor => {
        if(!prevFloor) return null;
        const newSeats = prevFloor.seats.map(s => s.id === newSeatData.id ? newSeatData : s);
        return {...prevFloor, seats: newSeats };
    });
  }

  const handleSaveChanges = () => {
    // In a real app, this would save the entire floorData object to Firestore
    console.log("Saving floor layout:", floorData);
    toast({
        title: "Layout Saved!",
        description: `Changes to ${floorData?.name} have been saved.`
    });
  }
  
  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><p>Loading Editor...</p></div>;
  }

  if (!floorData) {
    notFound();
  }

  return (
    <div className="flex h-screen bg-muted/40">
      <div className="flex-1 flex flex-col p-4 gap-4">
        <div className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm">
            <div>
                 <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Library
                </Button>
                <h1 className="text-2xl font-bold font-headline ml-4 inline-block align-middle">
                    Editing: {floorData.name}
                </h1>
            </div>
            <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
            </Button>
        </div>
        <Card className="flex-1">
          <CardContent className="p-4 md:p-6 h-full overflow-auto">
            <div 
              className="grid gap-1" 
              style={{gridTemplateColumns: `repeat(${floorData.gridSize.cols}, minmax(0, 1fr))`}}
            >
              {floorData.seats.map(seat => (
                <EditableSeat 
                    key={seat.id} 
                    seat={seat} 
                    onClick={handleSeatClick} 
                    isSelected={selectedSeat?.id === seat.id}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-[300px] bg-background border-l border-border p-4 shadow-lg">
         <EditorPalette selectedSeat={selectedSeat} onUpdateSeat={updateSeat} />
      </div>
    </div>
  );
}
