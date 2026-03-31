/**
 * Generate deterministic coordinates for a parcel based on its ID
 * This ensures the same parcel always appears in the same location on the map
 *
 * In a real system, this would fetch actual geodata from a geospatial database
 */

const MAP_CENTER: [number, number] = [19.8762, 75.3433]
const METERS_PER_DEGREE_LAT = 111_320
const METERS_PER_DEGREE_LNG = 111_320 * Math.cos((MAP_CENTER[0] * Math.PI) / 180)

// Grid parameters
const PARCEL_WIDTH_METERS = 40
const PARCEL_HEIGHT_METERS = 40
const SPACING_METERS = 5
const GRID_SIZE = 10 // 10x10 grid = 100 parcels max

/**
 * Generate rectangular polygon coordinates for a parcel
 * Uses parcel ID as a seed to place it deterministically in a grid
 */
export function generateParcelCoordinates(parcelId: bigint): [number, number][] {
  // Use parcel ID to determine grid position
  const idNum = Number(parcelId)
  const row = Math.floor((idNum - 1) / GRID_SIZE)
  const col = (idNum - 1) % GRID_SIZE

  // Calculate total grid dimensions
  const totalWidth = GRID_SIZE * PARCEL_WIDTH_METERS + (GRID_SIZE - 1) * SPACING_METERS
  const totalHeight = GRID_SIZE * PARCEL_HEIGHT_METERS + (GRID_SIZE - 1) * SPACING_METERS

  // Calculate starting position (top-left of grid)
  const startLat = MAP_CENTER[0] + (totalHeight / 2) / METERS_PER_DEGREE_LAT
  const startLng = MAP_CENTER[1] - (totalWidth / 2) / METERS_PER_DEGREE_LNG

  // Calculate center of this specific parcel
  const parcelCenterLat =
    startLat - (row * (PARCEL_HEIGHT_METERS + SPACING_METERS) + PARCEL_HEIGHT_METERS / 2) / METERS_PER_DEGREE_LAT
  const parcelCenterLng =
    startLng + (col * (PARCEL_WIDTH_METERS + SPACING_METERS) + PARCEL_WIDTH_METERS / 2) / METERS_PER_DEGREE_LNG

  // Create rectangle polygon
  const latOffset = (PARCEL_HEIGHT_METERS / 2) / METERS_PER_DEGREE_LAT
  const lngOffset = (PARCEL_WIDTH_METERS / 2) / METERS_PER_DEGREE_LNG

  return [
    [parcelCenterLat + latOffset, parcelCenterLng - lngOffset],
    [parcelCenterLat + latOffset, parcelCenterLng + lngOffset],
    [parcelCenterLat - latOffset, parcelCenterLng + lngOffset],
    [parcelCenterLat - latOffset, parcelCenterLng - lngOffset],
  ]
}

/**
 * Format parcel ID as display name
 */
export function formatParcelName(parcelId: bigint): string {
  return `Survey ${parcelId}`
}
