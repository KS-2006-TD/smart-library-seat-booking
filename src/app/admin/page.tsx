'use client';

import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const mockBookings = [
  { id: 'b1', student: 'Alice Johnson', library: 'Main Research Library', seat: 'A5', status: 'Pending' },
  { id: 'b2', student: 'Michael Chen', library: 'Science & Engineering Library', seat: 'C12', status: 'Booked' },
  { id: 'b3', student: 'David Lee', library: 'Main Research Library', seat: 'F8', status: 'Pending' },
  { id: 'b4', student: 'Sarah Williams', library: 'Arts & Humanities Library', seat: 'B2', status: 'Occupied' },
];

function AdminDashboard() {
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
              <CardTitle>Add New Library</CardTitle>
              <CardDescription>Expand the network of available libraries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lib-name">Library Name</Label>
                  <Input id="lib-name" placeholder="e.g., Grand Central Library" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lib-address">Address</Label>
                  <Input id="lib-address" placeholder="e.g., 456 Oak Avenue" />
                </div>
              </div>
              <Button>Add Library</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Add New Location</CardTitle>
              <CardDescription>Add new campuses or areas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loc-name">Location Name</Label>
                <Input id="loc-name" placeholder="e.g., South Campus" />
              </div>
              <Button>Add Location</Button>
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
