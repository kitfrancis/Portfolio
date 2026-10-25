"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { LogOut, Settings } from "lucide-react";

const inputClass =
  "w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-500";

export default function LoginPopover() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // lets Enter submit the form
    setLoading(true);
    setError("");
    const { error } = await signIn.email({ email, password });
    if (error) {
      const message = error.message || "Login failed. Check your email and password.";
      setError(message);
      toast.error(message);
    } else {
      toast.success("Welcome back, Master 👋");
      setPassword("");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
  };

  if (session) {
    return (
      <Button variant="outline" className="rounded-full text-sm" onClick={handleLogout}>
        <LogOut className="mr-1 h-4 w-4" /> Log out
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          aria-label="Log in to edit this portfolio"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-5">
        <form onSubmit={handleLogin} className="grid gap-4">
          <div>
            <h4 className="font-semibold">Log in to edit</h4>
            <p className="mt-1 text-sm text-muted-foreground">Only the site owner can make changes.</p>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="login-email" className="text-sm font-medium">Email</label>
            <input
              id="login-email"
              className={inputClass}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="login-password" className="text-sm font-medium">Password</label>
            <input
              id="login-password"
              className={inputClass}
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}