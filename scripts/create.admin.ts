import { auth } from "../lib/auth";

await auth.api.signUpEmail({
  body: {
    email: "kitbesa@mail.com",    
    password: "kitbesa2026",    
    name: "Kit Francis Besa",
  }
});

console.log("✅ Admin created!");
process.exit(0);