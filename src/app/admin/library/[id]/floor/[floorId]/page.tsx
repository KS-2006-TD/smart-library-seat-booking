
'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { libraries, Seat, Floor, TableGroup, OtherElement as OtherElementType } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import EditorPalette, { BrushType } from '@/components/admin/editor-palette';

// Re-usable components from the booking page to render the flexible layout
function Chair({ seat, onClick }: { seat: Seat, onClick: (id: string) => void }) {
  return (
    <div
      onClick={() => onClick(seat.id)}
      style={{
        transform: `rotate(${seat.rotation || 0}deg) translate(38px) rotate(-${seat.rotation || 0}deg)`,
      }}
      className={cn(
        'absolute top-1/2 left-1/2 -mt-3 -ml-3 h-6 w-6 rounded-md transition-all duration-200 bg-green-200 text-green-800 cursor-pointer hover:scale-110 hover:ring-2 ring-primary'
      )}
      aria-label={`Seat ${seat.label}`}
    >
       <div style={{ transform: `rotate(${-(seat.rotation || 0)}deg)` }} className="w-full h-full flex items-center justify-center text-[8px] font-bold">
        {seat.label}
       </div>
    </div>
  );
}

function Table({ table, onElementClick }: { table: TableGroup, onElementClick: (type: string, id: string) => void }) {
  return (
    <div
      className="relative group"
      style={{
        position: 'absolute',
        left: `${table.position.x}%`,
        top: `${table.position.y}%`,
        width: '120px',
        height: '120px',
      }}
    >
      <div 
        onClick={() => onElementClick('table', table.id)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md cursor-pointer group-hover:ring-2 ring-primary"
      >
        <span className="text-xs font-semibold text-gray-600">{table.label}</span>
      </div>
      {table.seats.map(seat => (
        <Chair
          key={seat.id}
          seat={seat}
          onClick={(id) => onElementClick('seat', id)}
        />
      ))}
    </div>
  );
}

function OtherElement({ element, onElementClick }: { element: OtherElementType, onElementClick: (type: string, id: string) => void }) {
  const typeStyles = {
    storage: 'bg-gray-200 border-gray-300 text-gray-600',
    reception: 'bg-gray-200 border-gray-300 text-gray-600',
    stack: 'bg-teal-400/80 border-teal-500 text-white',
  }
  return (
    <div
      onClick={() => onElementClick(element.type, element.id)}
      style={{
        position: 'absolute',
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        width: `${element.size.w}px`,
        height: `${element.size.h}px`,
      }}
      className={cn("flex items-center justify-center rounded-md border-2 cursor-pointer hover:ring-2 ring-primary", typeStyles[element.type])}
    >
       <span className="text-xs font-bold tracking-wide">{element.label}</span>
    </div>
  );
}

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
      {seat.type !== 'space' ? seatTypeIcons[seat.type] : <div className="w-full h-full bg-gray-100/50" /> }
      {seat.label && <span className="absolute text-[7px] font-bold text-black/60 pointer-events-none">{seat.label}</span>}
    </div>
  );
}

export default function FloorEditorPage({ params }: { params: { id: string, floorId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [libraryId, setLibraryId] = useState('');
  const [floorId, setFloorId] = useState('');

  const [floorData, setFloorData] = useState<Floor | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeBrush, setActiveBrush] = useState<BrushType>('seat');

  useEffect(() => {
    setLibraryId(params.id);
    setFloorId(params.floorId);
  }, [params.id, params.floorId]);

  useEffect(() => {
    if (libraryId && floorId) {
        const lib = libraries.find(l => l.id === libraryId);
        const floor = lib?.floors.find(f => f.id === floorId) ?? null;
        setFloorData(floor);
        setLoading(false);
    }
  }, [libraryId, floorId]);
  
  const updateSeat = (seatId: string) => {
    if (!activeBrush) return;

    setFloorData(prevFloor => {
        if(!prevFloor || !prevFloor.seats) return null;
        
        let seatCounter = prevFloor.seats.filter(s => s.type === 'seat' || s.type === 'group-seat').length;

        const newSeats = prevFloor.seats.map(s => {
            if (s.id === seatId) {
                const oldType = s.type;
                const newType = activeBrush;
                let newLabel = s.label;

                const wasSeat = oldType === 'seat' || oldType === 'group-seat';
                const isSeat = newType === 'seat' || newType === 'group-seat';
                
                if (newType === 'space') {
                    newLabel = '';
                } else if (isSeat && !wasSeat) {
                    seatCounter++;
                    newLabel = `${newType === 'seat' ? 'S' : 'G'}${seatCounter}`;
                } else if (!isSeat && wasSeat) {
                    newLabel = '';
                }

                return { ...s, type: newType, label: newLabel };
            }
            return s;
        });

        let currentSeatNumber = 1;
        const relabeledSeats = newSeats.map(s => {
            if(s.type === 'seat' || s.type === 'group-seat') {
                const prefix = s.type === 'seat' ? 'S' : 'G';
                return {...s, label: `${prefix}${currentSeatNumber++}`};
            }
            return s;
        });

        return {...prevFloor, seats: relabeledSeats };
    });
  }

  const handleElementClick = (type: string, id: string) => {
    // Placeholder for future editing functionality (e.g. drag, resize, property panel)
    console.log(`Selected ${type} with ID: ${id}`);
    toast({
        title: "Element Selected",
        description: `You clicked on a ${type} (ID: ${id}). Editing coming soon!`,
    })
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
  
  const isGridLayout = !!floorData.seats && !!floorData.gridSize;
  const isFlexibleLayout = !!floorData.layout;

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
      <div className="flex-1 flex flex-col p-4 gap-4" onMouseUp={isGridLayout ? handleMouseUp : undefined}>
        <div className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm">
            <div>
                <h1 className="text-2xl font-bold font-headline ml-4 inline-block align-middle">
                    Editing: {floorData.name}
                </h1>
                <p className='text-sm text-muted-foreground ml-4'>
                    {isGridLayout ? "Click and drag on the grid to draw your layout." : "Click on an element to select it. Drag & drop coming soon!"}
                </p>
            </div>
            <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Layout
            </Button>
        </div>
        <Card className="flex-1">
          <CardContent className="p-4 md:p-6 h-full overflow-auto">
            {isGridLayout ? (
                <div 
                  className="grid gap-1" 
                  style={{gridTemplateColumns: `repeat(${floorData.gridSize!.cols}, minmax(0, 1fr))`}}
                  onMouseLeave={handleMouseUp}
                >
                  {floorData.seats!.map(seat => (
                    <EditableSeat 
                        key={seat.id} 
                        seat={seat}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                    />
                  ))}
                </div>
            ) : isFlexibleLayout ? (
                <div className="bg-slate-50/20 relative min-h-[600px] overflow-hidden">
                    <div className="relative w-full h-[550px]">
                        {floorData.layout!.zones?.map(zone => (
                            <div key={zone.id} style={{ position: 'absolute', left: `${zone.position.x}%`, top: `${zone.position.y}%`}}>
                                <h3 className="text-lg font-bold text-gray-700">{zone.label}</h3>
                            </div>
                        ))}
                        {floorData.layout!.tables?.map(table => (
                            <Table key={table.id} table={table} onElementClick={handleElementClick} />
                        ))}
                        {floorData.layout!.otherElements?.map(el => (
                            <OtherElement key={el.id} element={el} onElementClick={handleElementClick} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    This floor does not have a configurable layout.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    