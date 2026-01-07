'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { libraries, Seat, Floor } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export default function EditLibraryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [library, setLibrary] = useState(() => {
    const lib = libraries.find(l => l.id === params.id);
    if (!lib) return null;
    return { ...lib };
  });
  
  if (!library) {
    notFound();
  }

  const [libraryName, setLibraryName] = useState(library.name);
  const [libraryAddress, setLibraryAddress] = useState(library.address);

  const handleSaveChanges = () => {
    // In a real app, this would save to Firestore
    console.log('Saving changes for library:', library.id, { name: libraryName, address: libraryAddress });
    toast({
        title: 'Changes Saved!',
        description: `${libraryName} has been updated.`,
    });
    // Here you would update the global state or refetch data
  };

  const handleAddFloor = () => {
    // Logic to add a new floor
    console.log("Adding a new floor...");
    toast({
        title: 'Feature Coming Soon',
        description: 'The ability to add and design new floors is under development.',
    });
  }

  const handleEditLayout = () => {
    toast({
        title: 'Feature Coming Soon',
        description: 'The floor plan editor is currently under development.',
    });
  }

  return (
    <div className="container py-8">
        <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Panel
            </Button>
        </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Edit Library</h1>
        <p className="text-muted-foreground">Modify details and manage floor plans for {library.name}.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>Library Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-lib-name">Library Name</Label>
                        <Input id="edit-lib-name" value={libraryName} onChange={(e) => setLibraryName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-lib-address">Address</Label>
                        <Input id="edit-lib-address" value={libraryAddress} onChange={(e) => setLibraryAddress(e.target.value)} />
                    </div>
                    <Button onClick={handleSaveChanges} className="w-full">Save Changes</Button>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Floor Plans & Seat Layouts</CardTitle>
                    <CardDescription>View and manage the seat maps for each floor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {library.floors.map(floor => (
                        <div key={floor.id} className="border p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{floor.name}</h3>
                                <p className="text-sm text-muted-foreground">{floor.seats.filter(s => ['seat', 'group-seat'].includes(s.type)).length} seats</p>
                            </div>
                            <Button variant="outline" onClick={handleEditLayout}>Edit Layout</Button>
                        </div>
                    ))}
                     <Button variant="secondary" className="w-full" onClick={handleAddFloor}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Floor
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
