"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Account created! Please check your email to confirm.");
      router.push("/sign-in");
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dandeal Admin
          </h1>
          <p className="text-gray-600">Create an admin account</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-700">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-orange-600 hover:text-orange-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

