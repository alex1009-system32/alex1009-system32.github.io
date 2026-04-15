import { useState } from "react";
import { useGitHubUser } from "../services/useGithub";

interface HeaderProps {
  username: string;
}

function Header({ username }: HeaderProps) {
  const [currentDate] = useState(new Date().toLocaleDateString());

  const { data: user, isLoading, isError, error } = useGitHubUser(username);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
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
            Working on Private Porjects
          </div>
        </div>
        <div>
          <img
            className="max-h-44 m-0 border-2 border-wood-950 outline rotate-3"
            src={user?.img_url}
          />
        </div>
      </div>
      <div className="border-2 border-sand-900 border-dashed h-0" />
    </>
  );
}

export default Header;
