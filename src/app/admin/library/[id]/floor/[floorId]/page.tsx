'use client';

import { useState, useEffect, useRef } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { libraries, Seat, Floor } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditorPalette, { BrushType } from '@/components/admin/editor-palette';

function EditableSeat({ seat, onMouseDown, onMouseEnter }: { seat: Seat, onMouseDown: (seatId: string) => void, onMouseEnter: (seatId: string) => void }) {
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
    <div
      onMouseDown={() => onMouseDown(seat.id)}
      onMouseEnter={() => onMouseEnter(seat.id)}
      className='aspect-square rounded-sm p-0.5 transition-all duration-150 relative flex items-center justify-center border-2 border-transparent hover:border-primary/50 cursor-crosshair'
      aria-label={`Grid cell ${seat.id}, Type: ${seat.type}`}
    >
      {seatTypeIcons[seat.type]}
      {seat.label && <span className="absolute text-[7px] font-bold text-black/60 pointer-events-none">{seat.label}</span>}
    </div>
  );
}

export default function FloorEditorPage({ params }: { params: { id: string, floorId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id: libraryId, floorId } = params;

  const [floorData, setFloorData] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeBrush, setActiveBrush] = useState<BrushType>('seat');

  useEffect(() => {
    if (libraryId && floorId) {
        const lib = libraries.find(l => l.id === libraryId);
        const floor = lib?.floors.find(f => f.id === floorId) ?? null;
        setFloorData(floor);
    }
    setLoading(false);
  }, [libraryId, floorId]);
  
  const updateSeat = (seatId: string) => {
    if (!activeBrush) return;

    setFloorData(prevFloor => {
        if(!prevFloor) return null;
        
        let seatCounter = prevFloor.seats.filter(s => s.type === 'seat' || s.type === 'group-seat').length;

        const newSeats = prevFloor.seats.map(s => {
            if (s.id === seatId) {
                const oldType = s.type;
                const newType = activeBrush;
                let newLabel = s.label;

                const wasSeat = oldType === 'seat' || oldType === 'group-seat';
                const isSeat = newType === 'seat' || newType === 'group-seat';

                if (isSeat && !wasSeat) {
                    seatCounter++;
                    newLabel = `${newType === 'seat' ? 'S' : 'G'}${seatCounter}`;
                } else if (!isSeat && wasSeat) {
                    newLabel = '';
                }

                return { ...s, type: newType, label: newLabel };
            }
            return s;
        });

        return {...prevFloor, seats: newSeats };
    });
  }

  const handleMouseDown = (seatId: string) => {
    setIsDrawing(true);
    updateSeat(seatId);
  }

  const handleMouseUp = () => {
    setIsDrawing(false);
  }

  const handleMouseEnter = (seatId: string) => {
    if (isDrawing) {
        updateSeat(seatId);
    }
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
      <div className="w-[300px] bg-background border-r border-border p-4 shadow-lg flex flex-col">
         <div className="mb-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Library
            </Button>
         </div>
         <EditorPalette activeBrush={activeBrush} onBrushSelect={setActiveBrush} />
      </div>
      <div className="flex-1 flex flex-col p-4 gap-4" onMouseUp={handleMouseUp}>
        <div className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm">
            <div>
                <h1 className="text-2xl font-bold font-headline ml-4 inline-block align-middle">
                    Editing: {floorData.name}
                </h1>
                <p className='text-sm text-muted-foreground ml-4'>Click and drag on the grid to draw your layout.</p>
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
              onMouseLeave={handleMouseUp} // Stop drawing if mouse leaves grid
            >
              {floorData.seats.map(seat => (
                <EditableSeat 
                    key={seat.id} 
                    seat={seat}
                    onMouseDown={handleMouseDown}
                    onMouseEnter={handleMouseEnter}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
