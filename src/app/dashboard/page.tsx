'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { libraries, locations, Location } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, BarChart2, BookOpen, Clock, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  "The expert in anything was once a beginner.",
  "The only way to do great work is to love what you do.",
  "Focus on your goal. Don’t look in any direction but ahead.",
  "The secret to getting ahead is getting started."
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [quote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const filteredLibraries = libraries.filter(lib =>
    selectedLocation === 'all' || lib.locationId === selectedLocation
  );

  return (
    <div className="container py-8">
      {/* Welcome and Stats Section */}
      <section className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
          Welcome back, {user?.displayName || 'Student'}!
        </h1>
        <p className="text-lg text-muted-foreground">{quote}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hours Studied</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48h</div>
              <p className="text-xs text-muted-foreground">Your record is 60h</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Booking Streak</CardTitle>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Library Finder Section */}
      <section id="book-now">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
              <h2 className="text-3xl font-bold font-headline">Find a Library</h2>
              <p className="text-muted-foreground">Select a location to see available libraries.</p>
          </div>
          <div className="w-full md:w-64">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Select a location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc: Location) => (
                  <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLibraries.map(lib => (
            <Link href={`/library/${lib.id}`} key={lib.id}>
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48 w-full">
                  <Image
                    src={lib.imageUrl}
                    alt={`Image of ${lib.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint="library building"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline">{lib.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {lib.address}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{lib.floors.length} floor(s) available for booking.</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filteredLibraries.length === 0 && (
              <div className="md:col-span-3 text-center py-10">
                <p className="text-muted-foreground">No libraries found for this location.</p>
                <Button variant="link" onClick={() => setSelectedLocation('all')}>Show all locations</Button>
              </div>
          )}
        </div>
        <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="#book-now">Book Your Seat Now</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
