"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

export default function LoginPopover() {
  return (
     <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-background opacity-15">⚙</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="leading-none font-medium pt-5 items-center justify-center flex">Login to Edit</h4>
                      <div className="flex flex-col gap-2 mt-10">
                        <label className="font-semibold text-md">Email</label>
                        <input className="border border-gray-200 rounded-sm px-3 py-2 items-center" type="email" placeholder="Enter your Email" />
                        <label className="">Password</label>
                        <input className="border border-gray-200 rounded-sm px-3 py-2 items-center" type="password" placeholder="Enter your Password" />

                        <Button
                                variant="outline"
                                className=" mt-5"
                                onClick={() => {
                                toast.promise<{ name: string }>(
                                    () =>
                                    new Promise((resolve) =>
                                        setTimeout(() => resolve({ name: "Admin" }), 2000)
                                    ),
                                    {
                                    loading: "Loading...",
                                    success: (data) => `${data.name} Login Successful!`,
                                    error: "Error",
                                    }
                                )
                                }}
                            >
                                Login
                            </Button>
                      </div>
                    </div>
                    </div>
                  </PopoverContent>
                </Popover>
  );
}