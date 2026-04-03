"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { signIn, signOut, useSession } from "@/lib/auth-client";

export default function LoginPopover() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn.email({ email, password });
    if (error) {
      toast.error(error.message || "Login failed!");
    } else {
      toast.success("Welcome back, Master 👋");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out!");
  };

  if (session) {
    return (
      <Button
        variant="outline"
        className="text-xs"
        onClick={handleLogout}
      >
        Logout
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-background opacity-15">⚙</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium pt-5 items-center justify-center flex">
              Login to Edit
            </h4>
            <div className="flex flex-col gap-2 mt-10">
              <label className="font-semibold text-md">Email</label>
              <input
                className="border border-gray-200 rounded-sm px-3 py-2"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label className="">Password</label>
              <input
                className="border border-gray-200 rounded-sm px-3 py-2"
                type="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="outline"
                className="mt-5"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}