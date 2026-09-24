// Editorial status for the public reading UI. Update this list as chapters are developed.
const unfinishedPoliticsFramework = new Set([
  "politics-information-media",
  "politics-ideology",
  "politics-institutions",
  "politics-polarization",
  "politics-democracy",
  "politics-corruption",
  "politics-reform-solutions",
  "politics-political-certainty",
]);

export function isSectionInProgress(id: string): boolean {
  return (
    unfinishedPoliticsFramework.has(id) ||
    (id.startsWith("politics-analysis-") &&
      id !== "politics-analysis-israel-palestine") ||
    id.startsWith("psychology-") ||
    id.startsWith("technology-")
  );
}
