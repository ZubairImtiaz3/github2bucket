import { createClient } from "@/utils/supabase/server";

const page = async () => {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();

  console.log("sesssion in repo", data);

  return (
    <>
      <div>Repositories</div>
    </>
  );
};

export default page;
