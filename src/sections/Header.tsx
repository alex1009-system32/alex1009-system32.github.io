import { useGitHubUser } from "@/features/github";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

type Props = {
  username: string;
};

function Header({ username }: Props) {
  const { data: user, isLoading, isError, error } = useGitHubUser(username);

  const currentDate = new Date().toLocaleDateString();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  return (
    <>
      <div className="flex justify-between font-mono uppercase">
        <div className="text-lg text-gravel-500 selection:bg-wood-800">
          <div>Date: {currentDate}</div>
        </div>
        <div className="text-lg text-gravel-500 selection:bg-wood-800">
          Loc: {user?.loc}
        </div>
      </div>
      <div className="flex justify-between my-10">
        <div>
          <div className="m-3 text-5xl text-wood-950 font-bold">
            {user?.name}
          </div>
          <div className="m-3 text-2xl text-wood-800 selection:bg-wood-800">
            Working on Private Projects
          </div>
        </div>
        <div>
          <img
            className="max-h-44 m-0 border-2 border-wood-950 outline rotate-3"
            src={user?.img_url}
            alt={
              user?.name ? `Profile picture of ${user.name}` : "Profile picture"
            }
          />
        </div>
      </div>
      <div className="border-2 border-sand-900 border-dashed h-0" />
    </>
  );
}

export default Header;
