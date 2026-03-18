import Link from "next/link";
import { Plane } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
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
