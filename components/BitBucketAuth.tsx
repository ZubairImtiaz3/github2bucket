"use client";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function BitBucketAuth() {
  const supabase = createClient();

  async function signInWithBitBucket() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "bitbucket",

      //TODO: fix redirectTo for prod
      options: {
        redirectTo: "http://localhost:3000/auth/bitbucket",
      },
    });
  }

  return (
    <>
      <Button onClick={signInWithBitBucket}>Connect your Bitbucket</Button>
    </>
  );
}
