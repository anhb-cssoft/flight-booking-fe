import Link from "next/link";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <header className="glass-nav border-b">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">SkyBooker</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Search
          </Link>
          <Link href="/my-bookings" className="transition-colors hover:text-primary">
            My Bookings
          </Link>
        </nav>
      </div>
    </header>
  );
}
