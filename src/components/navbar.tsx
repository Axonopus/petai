import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import Image from "next/image";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center">
          <div className="w-10 h-10 bg-[#FC8D68] rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="text-xl font-bold">GoPet AI</span>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="#features"
            className="text-gray-600 hover:text-[#FC8D68] font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-gray-600 hover:text-[#FC8D68] font-medium transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-gray-600 hover:text-[#FC8D68] font-medium transition-colors"
          >
            Testimonials
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="hidden sm:block">
                <Button className="bg-[#FC8D68] hover:bg-[#e87e5c]">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#FC8D68] transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/business-registration"
                className="px-4 py-2 text-sm font-medium text-white bg-[#FC8D68] rounded-md hover:bg-[#e87e5c] transition-colors"
              >
                Register Business
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
