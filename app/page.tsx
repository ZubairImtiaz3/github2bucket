import AuthComponent from "@/components/AuthComponent";

export default async function Index() {
  //TODO: show auth component only when there is no session

  return (
    <div className="flex-1 my-12 w-full flex flex-col gap-20 items-center text-3xl">
      GITHUB2BUCKET
      <AuthComponent />
    </div>
  );
}
