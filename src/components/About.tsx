import { useGitHubUser } from "../services/useGithub";

interface AboutProps {
  username: string;
}

function About({ username }: AboutProps) {
  const { data: user, isLoading, isError, error } = useGitHubUser(username);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="mt-9 font-mono uppercase mt-12 mb-6">
        <div className="text-2xl  text-wood-950 underline decoration-2 decoration-wood-800">
          01. ABOUT
        </div>
      </div>
      <div className="text-lg text-wood-900 font-mono">
        <span className="text-sand-500 bg-wood-950 px-1">MISSION:</span>{" "}
        {user?.bio}
      </div>
    </>
  );
}

export default About;
