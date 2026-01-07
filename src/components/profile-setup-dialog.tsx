'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getLocations } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export default function ProfileSetupDialog() {
  const { user, updateUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [locationId, setLocationId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const locations = getLocations();

  const handleSave = () => {
    if (!displayName || !locationId) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter your name and select a home campus.',
      });
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      updateUser({ displayName, locationId });
      toast({
        title: 'Profile Saved!',
        description: 'Welcome to Seatmylibrary!',
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <Dialog open={user?.isNewUser}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Seatmylibrary!</DialogTitle>
          <DialogDescription>
            Let's set up your profile. This will help us personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Campus
            </Label>
            <Select value={locationId} onValueChange={setLocationId}>
                <SelectTrigger id="location" className="col-span-3">
                    <SelectValue placeholder="Select your home campus" />
                </SelectTrigger>
                <SelectContent>
                    {locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save and Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
