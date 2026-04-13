export const fetchGitHubRepos = async (username: string) => {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch GitHub repositories");
  }

  return response.json();
};
