'use client';

import { useState } from 'react';
import { libraries, locations, Location } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

export default function DashboardPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredLibraries = libraries.filter(lib =>
    selectedLocation === 'all' || lib.locationId === selectedLocation
  );

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Find a Library</h1>
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
            <p className="md:col-span-3 text-center text-muted-foreground">No libraries found for this location.</p>
        )}
      </div>
    </div>
  );
}
