import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '@/components/map/LandMap.css'

export interface MapParcel {
  id: bigint
  name: string
  owner: string
  area: number
  coordinates: [number, number][]
  frozen?: boolean
  onSelect: (parcelId: bigint) => void
}

interface LandMapProps {
  parcels: MapParcel[]
  center?: [number, number]
  zoom?: number
  selectedParcelId?: bigint
}

export function LandMap({ 
  parcels, 
  center = [19.8762, 75.3433], 
  zoom = 18,
  selectedParcelId,
}: LandMapProps) {
  
  const getPolygonColor = (parcel: MapParcel) => {
    if (selectedParcelId === parcel.id) return '#ff6b6b' // Highlight selected
    if (parcel.frozen) return '#dc2626' // Red for frozen
    return '#2563eb' // Blue for active
  }

  const shortenAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%' }}
      className="land-map-container"
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render all land parcels as polygons */}
      {parcels.map((parcel) => (
        <Polygon
          key={parcel.id.toString()}
          positions={parcel.coordinates}
          pathOptions={{
            color: getPolygonColor(parcel),
            fillColor: getPolygonColor(parcel),
            fillOpacity: 0.6,
            weight: 2,
            dashArray: parcel.frozen ? '5, 5' : undefined, // Dashed line for frozen
          }}
          eventHandlers={{
            click: () => {
              parcel.onSelect(parcel.id)
            },
          }}
        >
          {/* Popup that shows on click */}
          <Popup>
            <div className="parcel-popup">
              <h3 className="font-bold text-sm">{parcel.name}</h3>
              <p className="text-xs text-gray-700 mt-1">
                <strong>Owner:</strong> {shortenAddress(parcel.owner)}
              </p>
              <p className="text-xs text-gray-700">
                <strong>Area:</strong> {parcel.area} m²
              </p>
              <p className="text-xs text-gray-700">
                <strong>Status:</strong>{' '}
                <span className={parcel.frozen ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                  {parcel.frozen ? '🔒 Frozen' : '✓ Active'}
                </span>
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  )
}
