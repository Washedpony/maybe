// Jamaica Parish Coordinates (latitude, longitude)
export const PARISH_COORDINATES: Record<string, { lat: number; lng: number; name: string }> = {
  Kingston: { lat: 17.9757, lng: -76.8066, name: "Kingston" },
  "St. Andrew": { lat: 18.0176, lng: -76.8114, name: "St. Andrew" },
  "St. Catherine": { lat: 17.9833, lng: -76.9167, name: "St. Catherine" },
  Manchester: { lat: 18.1167, lng: -77.3, name: "Manchester" },
  "St. James": { lat: 18.2667, lng: -77.9, name: "St. James" },
  Clarendon: { lat: 18.1, lng: -77.6667, name: "Clarendon" },
  "St. Ann": { lat: 18.3, lng: -77.2, name: "St. Ann" },
  Trelawny: { lat: 18.3, lng: -77.6, name: "Trelawny" },
  "St. Mary": { lat: 18.35, lng: -76.9, name: "St. Mary" },
  Portland: { lat: 18.4, lng: -76.4, name: "Portland" },
  "St. Thomas": { lat: 17.95, lng: -76.3, name: "St. Thomas" },
  Westmoreland: { lat: 18.2, lng: -78.3, name: "Westmoreland" },
}

export function getParishCoordinates(parish: string) {
  return PARISH_COORDINATES[parish] || PARISH_COORDINATES.Kingston
}

export function getJobDensityColor(jobCount: number): string {
  if (jobCount > 500) return "#dc2626" // red
  if (jobCount > 200) return "#f59e0b" // amber
  if (jobCount > 50) return "#eab308" // yellow
  return "#22c55e" // green
}
