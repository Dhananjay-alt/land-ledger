import type { MapParcel } from '@/components/map/LandMap'

// Sample owners with varied addresses
const SAMPLE_OWNERS = [
  '0xaB8483F64d9C6d1EcF9B849Ae677dD3315835cb2',
  '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  '0x70997970C51812e339D9B73b0245ad59Ba27A64c',
  '0x3C44CdDdB6a900c6671B6d3B5b5F3A1c088c2b35E',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  '0x976EA74026E726155ca251E5cDC1E752A4ECB333',
  '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
]

export function generateMockParcels(
  center: [number, number] = [19.8762, 75.3433],
  gridSize: number = 4, // 4x4 = 16 parcels
): MapParcel[] {
  const METERS_PER_DEGREE_LAT = 111_320
  const METERS_PER_DEGREE_LNG = 111_320 * Math.cos((center[0] * Math.PI) / 180)

  const parcels: MapParcel[] = []
  const parcelWidth = 40 // meters
  const parcelHeight = 40 // meters
  const spacingMeters = 5 // gap between parcels

  const totalWidth = gridSize * parcelWidth + (gridSize - 1) * spacingMeters
  const totalHeight = gridSize * parcelHeight + (gridSize - 1) * spacingMeters

  const startLat = center[0] + (totalHeight / 2) / METERS_PER_DEGREE_LAT
  const startLng = center[1] - (totalWidth / 2) / METERS_PER_DEGREE_LNG

  let id = 1000
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const parcelCenterLat =
        startLat - (row * (parcelHeight + spacingMeters) + parcelHeight / 2) / METERS_PER_DEGREE_LAT
      const parcelCenterLng =
        startLng + (col * (parcelWidth + spacingMeters) + parcelWidth / 2) / METERS_PER_DEGREE_LNG

      const latOffset = (parcelHeight / 2) / METERS_PER_DEGREE_LAT
      const lngOffset = (parcelWidth / 2) / METERS_PER_DEGREE_LNG

      const coordinates: [number, number][] = [
        [parcelCenterLat + latOffset, parcelCenterLng - lngOffset],
        [parcelCenterLat + latOffset, parcelCenterLng + lngOffset],
        [parcelCenterLat - latOffset, parcelCenterLng + lngOffset],
        [parcelCenterLat - latOffset, parcelCenterLng - lngOffset],
      ]

      const isFrozen = Math.random() < 0.2 // 20% chance of frozen
      const ownerIndex = Math.floor(Math.random() * SAMPLE_OWNERS.length)

      parcels.push({
        id: BigInt(id),
        name: `Survey ${id} - Plot ${row + 1}/${col + 1}`,
        owner: SAMPLE_OWNERS[ownerIndex],
        area: parcelWidth * parcelHeight,
        coordinates,
        frozen: isFrozen,
        onSelect: () => {},
      })

      id++
    }
  }

  return parcels
}

// Simplified 4x4 grid for testing
export const MOCK_PARCELS_16 = generateMockParcels([19.8762, 75.3433], 4)

// Original 5 sample parcels (can keep for reference)
function createRectPolygon(
  center: [number, number],
  widthMeters: number,
  heightMeters: number,
): [number, number][] {
  const METERS_PER_DEGREE_LAT = 111_320
  const METERS_PER_DEGREE_LNG = 111_320 * Math.cos((center[0] * Math.PI) / 180)

  const latOffset = (heightMeters / 2) / METERS_PER_DEGREE_LAT
  const lngOffset = (widthMeters / 2) / METERS_PER_DEGREE_LNG

  return [
    [center[0] + latOffset, center[1] - lngOffset],
    [center[0] + latOffset, center[1] + lngOffset],
    [center[0] - latOffset, center[1] + lngOffset],
    [center[0] - latOffset, center[1] - lngOffset],
  ]
}

export const SAMPLE_PARCELS_5: MapParcel[] = [
  {
    id: BigInt(2111),
    name: 'Survey 21/11 - Primary Plot',
    owner: '0xaB8483F64d9C6d1EcF9B849Ae677dD3315835cb2',
    area: 1800,
    coordinates: createRectPolygon([19.8762, 75.3433], 45, 40),
    frozen: false,
    onSelect: () => {},
  },
  {
    id: BigInt(2110),
    name: 'Survey 21/10 - Adjacent Plot',
    owner: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    area: 2200,
    coordinates: createRectPolygon([19.8765, 75.3425], 55, 40),
    frozen: true,
    onSelect: () => {},
  },
  {
    id: BigInt(2109),
    name: 'Survey 21/9 - Residential Plot',
    owner: '0x70997970C51812e339D9B73b0245ad59Ba27A64c',
    area: 1200,
    coordinates: createRectPolygon([19.8758, 75.3440], 30, 40),
    frozen: false,
    onSelect: () => {},
  },
  {
    id: BigInt(2201),
    name: 'City Block 22/1 - Commercial',
    owner: '0x3C44CdDdB6a900c6671B6d3B5b5F3A1c088c2b35E',
    area: 3000,
    coordinates: createRectPolygon([19.8768, 75.3444], 60, 50),
    frozen: true,
    onSelect: () => {},
  },
  {
    id: BigInt(2304),
    name: 'Layout 23/4 - Open Land',
    owner: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    area: 6400,
    coordinates: createRectPolygon([19.8753, 75.3429], 80, 80),
    frozen: false,
    onSelect: () => {},
  },
]
