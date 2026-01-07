
'use client';

import { useState, useMemo, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { libraries, Seat as SeatType, Floor, Library, TableGroup } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Users, Info, X, Sun, Tv, Book, Coffee, DoorOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import SeatSuggestionForm from '@/components/ai/seat-suggestion-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

function Chair({ seat, onSeatClick, isSelected, isSuggested }: { seat: SeatType, onSeatClick: (seat: SeatType) => void, isSelected: boolean, isSuggested: boolean }) {
  const seatStatusClasses = {
    Available: 'bg-teal-200 text-teal-800 hover:bg-teal-300 cursor-pointer',
    Occupied: 'bg-red-200 text-red-800 cursor-not-allowed',
    Booked: 'bg-slate-300 text-slate-600 cursor-not-allowed',
    Pending: 'bg-yellow-200 text-yellow-800 cursor-not-allowed',
  };

  const isInteractive = seat.status === 'Available';

  return (
    <div
      onClick={() => isInteractive && onSeatClick(seat)}
      style={{
        transform: `rotate(${seat.rotation || 0}deg) translate(38px) rotate(-${seat.rotation || 0}deg)`,
      }}
      className={cn(
        'absolute top-1/2 left-1/2 -mt-3 -ml-3 h-6 w-6 rounded-md transition-all duration-200',
        seatStatusClasses[seat.status],
        isInteractive && 'hover:scale-110',
        isSelected && 'ring-2 ring-offset-2 ring-primary',
        isSuggested && !isSelected && 'ring-2 ring-offset-1 ring-accent',
      )}
      aria-label={`Seat ${seat.label}, Status: ${seat.status}`}
    >
       {isSuggested && !isSelected && <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />}
       <div style={{ transform: `rotate(${-(seat.rotation || 0)}deg)` }} className="w-full h-full flex items-center justify-center text-[8px] font-bold">
        {/* You could add an icon here if you wanted */}
       </div>
    </div>
  );
}

function Table({ table, onSeatClick, selectedSeat, suggestedSeats }: { table: TableGroup, onSeatClick: (seat: SeatType) => void, selectedSeat: SeatType | null, suggestedSeats: string[] }) {
  return (
    <div
      className="relative"
      style={{
        position: 'absolute',
        left: `${table.position.x}%`,
        top: `${table.position.y}%`,
        width: '120px',
        height: '120px',
      }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-md">
        <span className="text-xs font-semibold text-gray-600">{table.label}</span>
      </div>
      {table.seats.map(seat => (
        <Chair
          key={seat.id}
          seat={seat}
          onSeatClick={onSeatClick}
          isSelected={selectedSeat?.id === seat.id}
          isSuggested={suggestedSeats.includes(seat.label)}
        />
      ))}
    </div>
  );
}

function OtherElement({ element }: { element: { id: string, label: string, position: { x: number, y: number }, size: { w: number, h: number }, type: 'storage' | 'reception' | 'stack' } }) {
  const typeStyles = {
    storage: 'bg-gray-200 border-gray-300 text-gray-600',
    reception: 'bg-gray-200 border-gray-300 text-gray-600',
    stack: 'bg-teal-400/80 border-teal-500 text-white',
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        width: `${element.size.w}px`,
        height: `${element.size.h}px`,
      }}
      className={cn("flex items-center justify-center rounded-md border-2", typeStyles[element.type])}
    >
       <span className="text-xs font-bold tracking-wide">{element.label}</span>
    </div>
  );
}

function SeatMap({ floor, onSeatSelect, selectedSeat, suggestedSeats }: { floor: Floor, onSeatSelect: (seat: SeatType) => void, selectedSeat: SeatType | null, suggestedSeats: string[] }) {
    if (!floor.layout) return <p>This floor does not have a layout configured.</p>;

    const { zones, tables, otherElements } = floor.layout;

    return (
      <Card className="bg-slate-50/20 relative min-h-[600px] overflow-hidden">
        <CardContent className="p-4 md:p-6 h-full">
            {/* Zones and Titles */}
            {zones?.map(zone => (
                 <div key={zone.id} style={{ position: 'absolute', left: `${zone.position.x}%`, top: `${zone.position.y}%`}}>
                    <h3 className="text-lg font-bold text-gray-700">{zone.label}</h3>
                 </div>
            ))}
           
            {/* Main Content Area */}
            <div className="relative w-full h-[550px]">
                {tables?.map(table => (
                    <Table key={table.id} table={table} onSeatClick={onSeatSelect} selectedSeat={selectedSeat} suggestedSeats={suggestedSeats} />
                ))}
                {otherElements?.map(el => (
                    <OtherElement key={el.id} element={el} />
                ))}
            </div>

        </CardContent>
      </Card>
    );
}

export default function LibraryPage({ params }: { params: { id: string } }) {
  const [libraryId, setLibraryId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [suggestedSeats, setSuggestedSeats] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const { toast } = useToast();
  
  const [libraryData, setLibraryData] = useState<Library | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);


  useEffect(() => {
    setLibraryId(params.id);
  }, [params.id]);


  useEffect(() => {
    if (libraryId) {
      const lib = libraries.find(l => l.id === libraryId);
      if (lib) {
        setLibraryData(lib);
      }
      setLoading(false);
    }
  }, [libraryId]);

  const handleSeatSelect = (seat: SeatType) => {
    if (seat.status === 'Available') {
      setSelectedSeat(seat);
      setTimeSlot(''); // Reset time slot when new seat is selected
    }
  };
  
  const handleOpenConfirmDialog = () => {
    if (!selectedSeat) {
      toast({
        variant: "destructive",
        title: "No Seat Selected",
        description: "Please click on an available seat to select it.",
      });
      return;
    }
    setIsConfirming(true);
  }

  const handleBooking = () => {
    if (!selectedSeat || !timeSlot) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please select a time slot.",
        })
        return;
    };
    
    setIsBooking(true);
    
    console.log(`Booking request for seat ${selectedSeat.label} for ${timeSlot}`);

    setTimeout(() => {
        setLibraryData(prevLibrary => {
            if (!prevLibrary) return null;

            const newFloors = prevLibrary.floors.map(floor => {
                if (!floor.layout?.tables) return floor;
                const newTables = floor.layout.tables.map(table => ({
                    ...table,
                    seats: table.seats.map(seat => 
                        seat.id === selectedSeat.id 
                        ? { ...seat, status: 'Pending' as SeatType['status'] } 
                        : seat
                    )
                }));
                return { ...floor, layout: { ...floor.layout, tables: newTables }};
            });
            return { ...prevLibrary, floors: newFloors };
        });

        setIsBooking(false);
        setIsConfirming(false);
        setSelectedSeat(null);
        setTimeSlot('');
        toast({
            title: "Request Sent!",
            description: `Your booking request for seat ${selectedSeat.label} is pending approval.`,
        });
    }, 1500);
  };
  
  const availableSeatsString = useMemo(() => {
    if (!libraryData) return '';
    return libraryData.floors
      .flatMap(f => f.layout?.tables || [])
      .flatMap(t => t.seats)
      .filter(s => s.status === 'Available')
      .map(s => s.label)
      .join(', ');
  }, [libraryData]);

  if (loading) {
    return <div className="container py-8">Loading library...</div>;
  }
  
  if (!libraryData || !libraryData.floors.length) {
    notFound();
  }
  
  const currentFloor = libraryData.floors[0];

  return (
    <div className="bg-slate-50 min-h-screen">
        <div className="container py-8">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold font-headline text-gray-800">{libraryData.name}</h1>
                <p className="text-muted-foreground">{currentFloor.name}</p>
            </div>

            <SeatMap floor={currentFloor} onSeatSelect={handleSeatSelect} selectedSeat={selectedSeat} suggestedSeats={suggestedSeats} />
            
             <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-sm z-50">
                <div className="bg-white rounded-xl shadow-2xl p-3 flex items-center justify-between gap-4">
                    <div className="font-semibold text-lg text-gray-700 flex-1 text-center">
                        Seat: <span className={cn("text-primary font-bold", !selectedSeat && "text-gray-400")}>{selectedSeat?.label ?? 'None'}</span>
                    </div>
                    <Button 
                        size="lg" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex-shrink-0"
                        onClick={handleOpenConfirmDialog}
                        disabled={!selectedSeat}
                    >
                        Confirm Reservation
                    </Button>
                </div>
            </div>

            <Dialog open={isConfirming} onOpenChange={(open) => !open && setIsConfirming(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Your Booking Request</DialogTitle>
                        <DialogDescription>
                            You are requesting to book seat <span className="font-bold text-primary">{selectedSeat?.label}</span>. 
                            Please select a time slot. Your request will be pending until an admin approves it.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <p><strong>Library:</strong> {libraryData.name}</p>
                            <p><strong>Floor:</strong> {currentFloor.name}</p>
                            <p><strong>Seat:</strong> {selectedSeat?.label}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time-slot" className="font-semibold">Time Slot</Label>
                            <Select value={timeSlot} onValueChange={setTimeSlot}>
                                <SelectTrigger id="time-slot">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <SelectValue placeholder="Select how long you want to book" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-hour">1 Hour</SelectItem>
                                    <SelectItem value="2-hours">2 Hours</SelectItem>
                                    <SelectItem value="4-hours">4 Hours</SelectItem>
                                    <SelectItem value="all-day">All Day</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsConfirming(false)} disabled={isBooking}>Cancel</Button>
                        <Button onClick={handleBooking} disabled={isBooking || !timeSlot}>
                            {isBooking ? 'Submitting Request...' : 'Confirm Request'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  );
}
