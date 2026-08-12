type Props = {
  error: Error | null;
};

/** Fehlerhinweis eines datenabhängigen Abschnitts. */
function ErrorState({ error }: Props) {
  return <div>Error: {error?.message}</div>;
}

export default ErrorState;
