"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/modetoggle";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function InvitePage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Handle the Supabase invitation token
    const handleInvitation = async () => {
      try {
        // Get the token from URL hash
        const hash = window.location.hash;
        console.log("URL Hash:", hash);

        // Supabase puts the token in the URL hash
        if (hash.includes("access_token")) {
          // Parse the hash to extract the access token
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const type = params.get("type");

          console.log("Access Token:", accessToken?.substring(0, 50) + "...");
          console.log("Type:", type);

          if (!accessToken || type !== "invite") {
            console.error("Invalid token or type");
            setError("Invalid invitation link");
            return;
          }

          // Set the session directly with the token from the URL
          const { data, error: setSessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: params.get("refresh_token") || "",
            });

          console.log("Set Session Data:", data);
          console.log("Set Session Error:", setSessionError);

          if (setSessionError) {
            console.error("Set session error:", setSessionError);
            setError("Failed to authenticate invitation link");
            return;
          }

          if (data?.user?.email) {
            console.log("Email found:", data.user.email);
            setEmail(data.user.email);
          } else {
            console.error("No email in user data");
            setError("Could not retrieve email from invitation link");
          }
        } else {
          console.error("No access_token in hash");
          setError("Invalid invitation link - missing token");
        }
      } catch (err) {
        console.error("Error handling invitation:", err);
        setError("An error occurred while processing your invitation");
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      handleInvitation();
    }
  }, [supabase]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords
      if (!password || !confirmPassword) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      console.log("Updating password for user:", email);

      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      console.log("Password updated successfully");

      // Activate the user in the database
      console.log("Activating user in database:", email);
      const activateResponse = await fetch("/api/activate-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!activateResponse.ok) {
        console.error("Failed to activate user");
        toast.error(
          "Password set, but failed to activate account. Please contact support."
        );
        setLoading(false);
        return;
      }

      console.log("User activated successfully");
      toast.success("Password set successfully! Redirecting to sign in...");

      // Sign out and redirect to sign-in
      await supabase.auth.signOut();
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch (err) {
      console.error("Error setting password:", err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex min-h-screen items-center justify-center">
        {/* Mode Toggle */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Dandeal Logistics & Importation
            </h1>
            <p className="">Set your password to activate your account</p>
          </div>

          <div className="border rounded-lg shadow-lg p-8">
            {error ? (
              <div className="text-center py-8">
                <div className="text-red-600 dark:text-red-400 mb-4">
                  <AlertCircle className="w-12 h-12 mx-auto" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Invalid Invitation Link
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {error}
                </p>
                <Button
                  onClick={() => router.push("/sign-in")}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Go to Sign In
                </Button>
              </div>
            ) : email ? (
              <form onSubmit={handleSetPassword} className="space-y-6">
                <div>
                  <Label className="">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="mt-2 bg-slate-100 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="">
                    New Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="">
                    Confirm Password
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading
                    ? "Setting password..."
                    : "Set Password & Activate Account"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400">
                  Loading invitation details...
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/sign-in")}
              className="text-orange-600 hover:text-orange-700 font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
