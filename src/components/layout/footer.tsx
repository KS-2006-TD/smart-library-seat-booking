import { Library, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/40 border-t mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <Library className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold font-headline">Seatmylibrary</span>
            </div>
            <p className="text-muted-foreground text-sm">Your one-stop solution for library seat booking.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 font-headline">Contact Us</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@seatmy.library</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (234) 567-890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Seatmylibrary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
