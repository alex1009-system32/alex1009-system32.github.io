/**
 * Ladehinweis eines datenabhängigen Abschnitts.
 *
 * Bewusst kein Wrapper um die Inhalte: Die Abschnitte kehren weiterhin früh
 * zurück, damit jeder für sich lädt und die Seite unverändert aussieht.
 */
function LoadingState() {
  return <div>Loading...</div>;
}

export default LoadingState;
