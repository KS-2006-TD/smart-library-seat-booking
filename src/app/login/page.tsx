'use client';

import { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Library, User, Shield } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>('user');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      login(email, role);
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    // For this mock, we will use a predefined user email.
    // In a real app, this would trigger the Firebase Google Auth popup.
    setIsLoading(true);
    // Google sign-in should always be for 'user' role in this mock
    const userEmail = "student.user@example.com"; 
    setTimeout(() => {
      login(userEmail, 'user');
      setIsLoading(false);
    }, 1000);
  };
  
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setEmail('admin@gmail.com');
    } else {
      setEmail('');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Library className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to find your perfect study spot.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
             <RadioGroup defaultValue="user" onValueChange={(value: UserRole) => handleRoleChange(value)} className="grid grid-cols-2 gap-4">
                <div>
                    <RadioGroupItem value="user" id="user" className="peer sr-only" />
                    <Label
                    htmlFor="user"
                    className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        role === 'user' && "border-primary"
                    )}
                    >
                    <User className="mb-3 h-6 w-6" />
                    Student
                    </Label>
                </div>
                <div>
                    <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                    <Label
                    htmlFor="admin"
                    className={cn(
                        "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        role === 'admin' && "border-primary"
                    )}
                    >
                    <Shield className="mb-3 h-6 w-6" />
                    Admin
                    </Label>
                </div>
            </RadioGroup>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === 'admin' ? 'admin@gmail.com' : 'your-email@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || role === 'admin'}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In with Email'}
            </Button>
          </form>
          {role === 'user' && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path><path fill="currentColor"d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
