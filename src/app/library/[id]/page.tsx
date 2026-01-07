'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { libraries, Seat as SeatType, Floor } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Users, Info, X, Sun, Tv, Book, Coffee, DoorOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import SeatSuggestionForm from '@/components/ai/seat-suggestion-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

function Seat({ seat, onSeatClick, isSuggested }: { seat: SeatType, onSeatClick: (seat: SeatType) => void, isSuggested: boolean }) {
  const seatStatusClasses = {
    Available: 'bg-green-200 text-green-800 hover:bg-green-300 cursor-pointer',
    Occupied: 'bg-red-200 text-red-800 cursor-not-allowed',
    Booked: 'bg-blue-200 text-blue-800 cursor-not-allowed',
    Pending: 'bg-yellow-200 text-yellow-800 cursor-not-allowed',
  };

  const seatTypeIcons = {
    seat: <Armchair className="w-full h-full p-0.5" />,
    'group-seat': <Users className="w-full h-full p-0.5" />,
    wall: <div className="w-full h-full bg-slate-300 rounded-sm" />,
    window: <div className="w-full h-full bg-blue-100 flex items-center justify-center rounded-sm"><Sun className="w-4 h-4 text-blue-400"/></div>,
    'book-shelf': <div className="w-full h-full bg-orange-100 flex items-center justify-center rounded-sm"><Book className="w-4 h-4 text-orange-400"/></div>,
    'coffee-station': <div className="w-full h-full bg-yellow-100 flex items-center justify-center rounded-sm"><Coffee className="w-4 h-4 text-yellow-600"/></div>,
    'entrance': <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-sm"><DoorOpen className="w-4 h-4 text-gray-600"/></div>,
    space: <div />,
  };
  
  const isInteractiveSeat = ['seat', 'group-seat'].includes(seat.type);

  if (!isInteractiveSeat) {
    return <div className="aspect-square flex items-center justify-center p-0.5">{seatTypeIcons[seat.type]}</div>;
  }

  return (
    <button
      onClick={() => onSeatClick(seat)}
      disabled={seat.status !== 'Available'}
      className={cn(
        'aspect-square rounded-md p-0.5 transition-all duration-200 relative flex items-center justify-center',
        seatStatusClasses[seat.status],
        isSuggested && 'ring-2 ring-offset-2 ring-accent'
      )}
      aria-label={`Seat ${seat.label}, Status: ${seat.status}`}
    >
      {seatTypeIcons[seat.type]}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-foreground/80">{seat.label}</span>
      {isSuggested && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />}
    </button>
  );
}

function SeatMap({ floor, onSeatSelect, suggestedSeats }: { floor: Floor, onSeatSelect: (seat: SeatType) => void, suggestedSeats: string[] }) {
  const gridCols = `grid-cols-${floor.gridSize.cols}`;
  
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className={cn('grid gap-4', gridCols)} style={{gridTemplateColumns: `repeat(${floor.gridSize.cols}, minmax(0, 1fr))`}}>
          {floor.seats.map(seat => (
            <Seat key={seat.id} seat={seat} onSeatClick={onSeatSelect} isSuggested={suggestedSeats.includes(seat.label)} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


export default function LibraryPage({ params }: { params: { id: string } }) {
  const [selectedSeat, setSelectedSeat] = useState<SeatType | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [suggestedSeats, setSuggestedSeats] = useState<string[]>([]);
  const [timeSlot, setTimeSlot] = useState<string>('');
  const { toast } = useToast();
  const [currentParams] = useState(params);

  // Use state for libraries to allow updates
  const [libraryData, setLibraryData] = useState(() => libraries.find(lib => lib.id === currentParams.id));

  if (!libraryData) {
    notFound();
  }

  const handleSeatSelect = (seat: SeatType) => {
    if (seat.status === 'Available') {
      setSelectedSeat(seat);
      setTimeSlot(''); // Reset time slot when new seat is selected
    }
  };

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

    // In a real app, this would trigger a Firestore write.
    // For this mock, we'll simulate the process and update local state.
    setTimeout(() => {
        setLibraryData(prevLibrary => {
            if (!prevLibrary) return prevLibrary;
            
            const newFloors = prevLibrary.floors.map(floor => ({
                ...floor,
                seats: floor.seats.map(seat => 
                    seat.id === selectedSeat.id 
                    ? { ...seat, status: 'Pending' } 
                    : seat
                )
            }));
            return { ...prevLibrary, floors: newFloors };
        });

        setIsBooking(false);
        setSelectedSeat(null);
        setTimeSlot('');
        toast({
            title: "Request Sent!",
            description: `Your booking request for seat ${selectedSeat.label} is pending approval.`,
        });
    }, 1500);
  };
  
  const availableSeatsString = useMemo(() => {
    return libraryData.floors.flatMap(f => f.seats)
      .filter(s => ['seat', 'group-seat'].includes(s.type) && s.status === 'Available')
      .map(s => s.label)
      .join(', ');
  }, [libraryData.floors]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">{libraryData.name}</h1>
        <p className="text-muted-foreground">{libraryData.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Tabs defaultValue={libraryData.floors[0].id} className="w-full">
            <TabsList className="grid w-full" style={{gridTemplateColumns: `repeat(${libraryData.floors.length}, 1fr)`}}>
                {libraryData.floors.map(floor => (
                    <TabsTrigger key={floor.id} value={floor.id}>{floor.name}</TabsTrigger>
                ))}
            </TabsList>
            {libraryData.floors.map(floor => (
                <TabsContent key={floor.id} value={floor.id}>
                    <SeatMap floor={floor} onSeatSelect={handleSeatSelect} suggestedSeats={suggestedSeats} />
                </TabsContent>
            ))}
            </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5" /> Legend</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-200"></div> Available</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-red-200"></div> Occupied</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-200"></div> Booked</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-200"></div> Pending</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full ring-2 ring-accent"></div> Suggested</div>
                <div className="flex items-center gap-2"><Armchair className="w-4 h-4" /> Single Seat</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> Group Seat</div>
                <div className="flex items-center gap-2"><div className="p-2 rounded bg-blue-100"><Sun className="w-4 h-4 text-blue-400" /></div> Window</div>
                <div className="flex items-center gap-2"><div className="p-2 rounded bg-orange-100"><Book className="w-4 h-4 text-orange-400" /></div> Shelf</div>
            </CardContent>
          </Card>
          <SeatSuggestionForm 
            availableSeats={availableSeatsString} 
            onSuggestion={setSuggestedSeats} 
          />
        </div>
      </div>
      
      <Dialog open={!!selectedSeat} onOpenChange={(open) => !open && setSelectedSeat(null)}>
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
                    <p><strong>Floor:</strong> {libraryData.floors.find(f => f.seats.some(s => s.id === selectedSeat?.id))?.name}</p>
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
                <Button variant="outline" onClick={() => setSelectedSeat(null)} disabled={isBooking}>Cancel</Button>
                <Button onClick={handleBooking} disabled={isBooking}>
                    {isBooking ? 'Submitting Request...' : 'Confirm Request'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
