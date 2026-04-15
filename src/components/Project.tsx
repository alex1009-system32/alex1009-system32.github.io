import { useGitHubRepo } from "../services/useGithub";

interface ProjectProps {
  username: string;
}

function Projects({ username }: ProjectProps) {
  const { data: repos, isLoading, isError, error } = useGitHubRepo(username);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
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
          {repos.map((repo: any) => (
            <div className="relative group my-9">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-sand-900 group-hover:bg-wood-950"></div>
              <div className="absolute left-3.25 top-0 w-4 h-4 bg-sand-900 rounded-full group-hover:bg-wood-950"></div>
              <div className="pl-9">
                <div className="text-wood-950 group-hover:underline">
                  CASE_FILE_{repo.id}: {repo.name}
                </div>
                <div className="my-3 text-sm text-gravel-500">
                  <p className="my-3">LAST-Updated: {repo.last_updated}</p>
                  <p className="my-3">
                    STATUS: {repo.archived == true ? "Archivid" : "Live"}
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
                  >
                    {">>"} COURCE CODE
                  </a>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export default Projects;
