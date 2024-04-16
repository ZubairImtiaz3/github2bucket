"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function AuthComponent() {
  const supabase = createClient();

  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",

      //TODO: fix redirectTo for prod
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <>
      <Button onClick={signInWithGithub}>Connect your Github</Button>
      <Button onClick={logOut}>Logout</Button>
    </>
  );
}
