import { createClient } from "@/utils/supabase/server";
import AuthComponent from "@/components/AuthComponent";

export default async function Index() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  console.log(data);

  return (
    <div className="flex-1 my-12 w-full flex flex-col gap-20 items-center text-3xl">
      GITHUB2BUCKET
      <AuthComponent />
    </div>
  );
}
