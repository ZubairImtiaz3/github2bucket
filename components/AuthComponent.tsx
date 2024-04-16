"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function AuthComponent() {
  const supabase = createClient();

  async function signInWithGithub() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });
    console.log("dataLogin", data);
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut();
    console.log("error logout", error);
  }

  return (
    <>
      <Button onClick={signInWithGithub}>Connect your Github</Button>
      <Button onClick={logOut}>Logout</Button>
    </>
  );
}
