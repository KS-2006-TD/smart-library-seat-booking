'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Library, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const showLoginState = !['/login', '/'].includes(pathname) || user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Library className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline sm:inline-block">Seatmylibrary</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          {user && <Link href={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-foreground/60 transition-colors hover:text-foreground/80">Dashboard</Link>}
        </nav>
        <div className="flex items-center justify-end space-x-4">
          {loading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === 'admin' ? '/admin' : '/dashboard'}><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin"><UserIcon className="mr-2 h-4 w-4" /> Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !pathname.includes('/login') && (
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
