import { RepoTable } from "@/components/RepoTable";
import { fetchRepositories } from "@/utils/client/basicUtlis";
import { createClient } from "@/utils/supabase/server";

const page = async () => {
  //Todo: Make sure the user is logged in and has a valid token

  const supabase = createClient();
  await supabase.auth.getUser();
  const { data } = await supabase.auth.getSession();

  // Extracting provider_token from the session
  const providerToken = data.session?.provider_token || "";

  console.log(data);

  // Fetching repositories from GitHub
  const Repos = await fetchRepositories(providerToken);

  return (
    <>
      <div className="p-10">
        <h1 className="text-center">Repositories</h1>
        <div className="max-w-[90%] mx-auto">
          <RepoTable Repos={Repos} />
        </div>
      </div>
    </>
  );
};

export default page;
