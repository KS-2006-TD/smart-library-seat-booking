'use client';

import { useState, useMemo } from 'react';
import { notFound } from 'next/navigation';
import { libraries, Seat as SeatType, Floor } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Armchair, Users, Info, X, Sun, Tv } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import SeatSuggestionForm from '@/components/ai/seat-suggestion-form';

function Seat({ seat, onSeatClick, isSuggested }: { seat: SeatType, onSeatClick: (seat: SeatType) => void, isSuggested: boolean }) {
  const seatStatusClasses = {
    Available: 'bg-green-200 text-green-800 hover:bg-green-300 cursor-pointer',
    Occupied: 'bg-red-200 text-red-800 cursor-not-allowed',
    Booked: 'bg-yellow-200 text-yellow-800 cursor-not-allowed',
    Pending: 'bg-blue-200 text-blue-800 cursor-not-allowed',
  };

  const seatTypeIcons = {
    seat: <Armchair className="w-full h-full" />,
    wall: <div className="w-full h-full bg-gray-300" />,
    window: <div className="w-full h-full bg-blue-100 flex items-center justify-center"><Sun className="w-4 h-4 text-blue-400"/></div>,
    space: <div />,
  };

  if (seat.type !== 'seat') {
    return <div className="aspect-square flex items-center justify-center">{seatTypeIcons[seat.type]}</div>;
  }

  return (
    <button
      onClick={() => onSeatClick(seat)}
      disabled={seat.status !== 'Available'}
      className={cn(
        'aspect-square rounded-md p-1 transition-all duration-200 relative',
        seatStatusClasses[seat.status],
        isSuggested && 'ring-2 ring-offset-2 ring-accent'
      )}
      aria-label={`Seat ${seat.label}, Status: ${seat.status}`}
    >
      {seatTypeIcons[seat.type]}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-semibold text-foreground/70">{seat.label}</span>
      {isSuggested && <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent animate-pulse" />}
    </button>
  );
}

function SeatMap({ floor, onSeatSelect, suggestedSeats }: { floor: Floor, onSeatSelect: (seat: SeatType) => void, suggestedSeats: string[] }) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-15 gap-2 md:gap-3">
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

  const library = useMemo(() => libraries.find(lib => lib.id === params.id), [params.id]);

  if (!library) {
    notFound();
  }

  const handleSeatSelect = (seat: SeatType) => {
    if (seat.status === 'Available') {
      setSelectedSeat(seat);
    }
  };

  const handleBooking = () => {
    if (!selectedSeat) return;
    setIsBooking(true);
    setTimeout(() => {
        // In a real app, you would update Firestore here
        console.log(`Booking seat ${selectedSeat.label}`);
        setIsBooking(false);
        setSelectedSeat(null);
    }, 1500);
  };
  
  const availableSeatsString = useMemo(() => {
    return library.floors.flatMap(f => f.seats)
      .filter(s => s.status === 'Available' && s.type === 'seat')
      .map(s => s.label)
      .join(', ');
  }, [library.floors]);

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline">{library.name}</h1>
        <p className="text-muted-foreground">{library.address}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Tabs defaultValue={library.floors[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                {library.floors.map(floor => (
                    <TabsTrigger key={floor.id} value={floor.id}>{floor.name}</TabsTrigger>
                ))}
            </TabsList>
            {library.floors.map(floor => (
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
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-yellow-200"></div> Booked</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-200"></div> Pending</div>
                 <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-100"></div> Window</div>
                <div className="flex items-center gap-2"><div className="w-4 h-4 rounded ring-2 ring-accent"></div> Suggested</div>
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
                <DialogTitle>Confirm Your Booking</DialogTitle>
                <DialogDescription>
                    You are about to book seat <span className="font-bold text-primary">{selectedSeat?.label}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <p><strong>Library:</strong> {library.name}</p>
                <p><strong>Floor:</strong> {library.floors.find(f => f.seats.some(s => s.id === selectedSeat?.id))?.name}</p>
                <p><strong>Seat:</strong> {selectedSeat?.label}</p>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedSeat(null)} disabled={isBooking}>Cancel</Button>
                <Button onClick={handleBooking} disabled={isBooking}>
                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
