import { useEffect } from 'react'

export interface GeoJSONFeature {
  type: 'Feature'
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
  properties: {
    parcelId: number
    name: string
    owner: string
  }
}

export interface LatLng {
  lat: number
  lng: number
}

export function latLngToString(latLng: LatLng): string {
  return `${latLng.lat.toFixed(4)}, ${latLng.lng.toFixed(4)}`
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}
