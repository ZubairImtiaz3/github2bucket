import { RepoTable } from "@/components/RepoTable";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";

const page = async () => {
  const supabase = createClient();

  await supabase.auth.getUser();
  const { data } = await supabase.auth.getSession();

  // Extracting the provider_token from the session
  const providerToken = data.session?.provider_token;

  // try {
  //   // Making request to GitHub API
  //   const response = await axios.get("https://api.github.com/user/repos", {
  //     headers: {
  //       Authorization: `bearer ${providerToken}`,
  //     },
  //   });

  //   console.log("GitHub repositories:", response.data);
  // } catch (error) {
  //   console.log(error);
  // }

  return (
    <>
      <div className="p-10">
        <h1 className="text-center">Repositories</h1>
        <div className="max-w-[90%] mx-auto">
          <RepoTable />
        </div>
      </div>
    </>
  );
};

export default page;
