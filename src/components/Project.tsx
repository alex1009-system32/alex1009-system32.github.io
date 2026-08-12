import { useState } from "react";
import { useGitHubRepos } from "../features/github";
import LoadingState from "./ui/LoadingState";
import ErrorState from "./ui/ErrorState";

interface ProjectProps {
  username: string;
}

function Projects({ username }: ProjectProps) {
  const [visibileCount, setVisibleCount] = useState(3);
  const { data: repos, isLoading, isError, error } = useGitHubRepos(username);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 3);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} />;
  }

  if (!repos) {
    return null;
  }

  return (
    <>
      <div className="font-mono uppercase mt-12 mb-6">
        <div className="text-2xl  text-wood-950 underline decoration-2 decoration-wood-800">
          02. Projects
        </div>
      </div>
      <div>
        <section>
          {repos.slice(0, visibileCount).map((repo) => (
            <div key={repo.id} className="relative group my-9">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-sand-900 group-hover:bg-wood-950"></div>
              <div className="absolute left-3.25 top-0 w-4 h-4 bg-sand-900 rounded-full group-hover:bg-wood-950"></div>
              <div className="pl-9">
                <div className="text-wood-950 group-hover:underline">
                  CASE_FILE_{repo.id}: {repo.name}
                </div>
                <div className="my-3 text-sm text-gravel-500">
                  <p className="my-3">LAST-Updated: {repo.last_updated}</p>
                  <p className="my-3">
                    STATUS: {repo.archived ? "Archivid" : "Live"}
                  </p>
                  <p className="my-3">LANGUAGE: {repo.language}</p>
                </div>
                <div className="text-lg max-w-2xl">
                  {repo.description
                    ? repo.description
                    : "No description provided."}
                </div>
                <div className="flex gap-4 mt-2">
                  <a
                    className="text-sm underline hover:text-sand-500 hover:bg-wood-950 p-0"
                    href={repo.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {">>"} COURCE CODE
                  </a>
                </div>
              </div>
            </div>
          ))}
          {visibileCount < repos.length && (
            <div className="flex justify-center align-middle">
              <button
                className="text-sm underline hover:text-sand-500 hover:bg-wood-950 p-0"
                onClick={handleLoadMore}
              >
                Show More
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Projects;
