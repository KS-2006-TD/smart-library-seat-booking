'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { libraries as initialLibraries, locations as initialLocations, Location, Library } from '@/lib/data';

const mockBookings = [
  { id: 'b1', student: 'Alice Johnson', library: 'Main Research Library', seat: 'A5', status: 'Pending' },
  { id: 'b2', student: 'Michael Chen', library: 'Science & Engineering Library', seat: 'C12', status: 'Booked' },
  { id: 'b3', student: 'David Lee', library: 'Main Research Library', seat: 'F8', status: 'Pending' },
  { id: 'b4', student: 'Sarah Williams', library: 'Arts & Humanities Library', seat: 'B2', status: 'Occupied' },
];

function AdminDashboard() {
  const [libraries, setLibraries] = useState<Library[]>(initialLibraries);
  const [locations, setLocations] = useState<Location[]>(initialLocations);

  const [newLibraryName, setNewLibraryName] = useState('');
  const [newLibraryAddress, setNewLibraryAddress] = useState('');
  const [newLocationName, setNewLocationName] = useState('');

  const handleAddLibrary = () => {
    // In a real app, you'd also select a location and define floors/seats.
    // This is a simplified mock for now.
    if (!newLibraryName || !newLibraryAddress) return;
    const newLibrary: Library = {
        id: `lib-${Date.now()}`,
        name: newLibraryName,
        address: newLibraryAddress,
        locationId: 'loc-1', // Mock location
        imageUrl: 'https://picsum.photos/seed/newlib/600/400',
        floors: [],
    };
    setLibraries([...libraries, newLibrary]);
    setNewLibraryName('');
    setNewLibraryAddress('');
  };

  const handleAddLocation = () => {
    if (!newLocationName) return;
    const newLocation: Location = {
        id: `loc-${Date.now()}`,
        name: newLocationName,
    };
    setLocations([...locations, newLocation]);
    setNewLocationName('');
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Panel</h1>
        <p className="text-muted-foreground">Manage libraries, locations, and bookings.</p>
      </div>
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bookings">Approve Bookings</TabsTrigger>
          <TabsTrigger value="libraries">Manage Libraries</TabsTrigger>
          <TabsTrigger value="locations">Manage Locations</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Booking Approvals</CardTitle>
              <CardDescription>Review and approve pending seat bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Library</TableHead>
                    <TableHead>Seat</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.student}</TableCell>
                      <TableCell>{booking.library}</TableCell>
                      <TableCell>{booking.seat}</TableCell>
                      <TableCell>
                        <Badge variant={booking.status === 'Pending' ? 'destructive' : 'default'}>{booking.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {booking.status === 'Pending' && (
                          <div className="space-x-2">
                             <Button size="sm" variant="outline">Decline</Button>
                             <Button size="sm">Approve</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="libraries">
          <Card>
            <CardHeader>
              <CardTitle>Manage Libraries</CardTitle>
              <CardDescription>Add or edit libraries in your network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">Add New Library</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="lib-name">Library Name</Label>
                        <Input id="lib-name" placeholder="e.g., Grand Central Library" value={newLibraryName} onChange={(e) => setNewLibraryName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="lib-address">Address</Label>
                        <Input id="lib-address" placeholder="e.g., 456 Oak Avenue" value={newLibraryAddress} onChange={(e) => setNewLibraryAddress(e.target.value)} />
                        </div>
                    </div>
                    <Button onClick={handleAddLibrary}>Add Library</Button>
               </div>
               <div>
                <h3 className="font-semibold mb-4">Existing Libraries</h3>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {libraries.map(lib => (
                            <TableRow key={lib.id}>
                                <TableCell>{lib.name}</TableCell>
                                <TableCell>{lib.address}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Manage Locations</CardTitle>
              <CardDescription>Add new campuses or cities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">Add New Location</h3>
                <div className="space-y-2">
                    <Label htmlFor="loc-name">Location Name</Label>
                    <Input id="loc-name" placeholder="e.g., South Campus" value={newLocationName} onChange={(e) => setNewLocationName(e.target.value)} />
                </div>
                <Button onClick={handleAddLocation}>Add Location</Button>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Existing Locations</h3>
                <Table>
                    <TableHeader>
                        <TableRow><TableHead>Name</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                        {locations.map(loc => (
                            <TableRow key={loc.id}>
                                <TableCell>{loc.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPage() {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div className="container py-8 text-center">Loading...</div>;
    }

    if (user?.role !== 'admin') {
        return (
            <div className="container py-20 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
            </div>
        )
    }

    return <AdminDashboard />;
}
