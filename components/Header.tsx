"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-orange-400 font-bold text-xl">Dandeal</div>
            <div className="text-white text-xs ml-2">
              <div>Logistics &</div>
              <div>Importation</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Home
            </a>
            <div className="relative group">
              <button className="text-white hover:text-orange-600 transition text-sm flex items-center">
                About <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href="/why-als"
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-orange-600 text-sm first:rounded-t-lg"
                >
                  Why Dandeal
                </a>
                <a
                  href="/terms-and-conditions"
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-orange-600 text-sm last:rounded-b-lg"
                >
                  Terms and Conditions
                </a>
              </div>
            </div>
            <a
              href="/services"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Services
            </a>
            <a
              href="/news"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              News
            </a>
            <a
              href="/faq"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              FAQ's
            </a>
            <a
              href="/contact"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Contact
            </a>
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block text-right">
              <div className="text-white text-xs">
                <div>+49 15212203183</div>
              </div>
            </div>
            <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-6">
              Get a Free Quote
            </Button>

            {/* Authentication */}
            {!loading && (
              <>
                {!user ? (
                  <>
                    <Link href="/sign-in">
                      <Button
                        variant="ghost"
                        className="text-white hover:text-orange-600"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <span className="text-white text-sm">{user.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-white hover:text-orange-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
