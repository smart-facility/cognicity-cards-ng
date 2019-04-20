import { Injectable } from "@angular/core";

type deckType = 'fire' | 'earthquake' | 'wind' | 'haze' | 'volcano'
type deckSubType = 'fire' | 'haze' | 'road' | 'structure' | 'wind' | 'volcano'

interface LatLng {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  type: deckType
  subType: deckSubType

  structureFailure = 1
  visibility = 1
  airQuality = 0
  accessibility = 0
  condition = 1
  location: LatLng
  fireLocation: LatLng
  fireRadius: LatLng
  fireDistance: number

  description: string = ''
  preview: File

  get isDescriptioORPhotoFilled() {
    return !!this.getPreview() || !!this.getDescription()
  }

  async isLocationInIndonesia() {
    const response = await fetch(`
      https://nominatim.openstreetmap.org/reverse
      ?format=json&lat=${this.location.lat}&lon=${this.location.lng}`)

    const geocodeData = await response.json()

    return geocodeData.address.country_code === 'id'
  }

  // Getter
  getDeckType() { return this.type; }
  getDeckSubType() { return this.subType }

  getStructureFailure() { return this.structureFailure };
  getVisibility(): number { return this.visibility; }
  getAirQuality(): number { return this.airQuality; }
  getAccessibility() { return this.accessibility }
  getCondition() { return this.condition }
  getLocation() { return this.location }
  getFireLocation(): LatLng { return this.fireLocation }
  getFireRadius(): LatLng { return this.fireRadius }
  getFireDistance(): number { return this.fireDistance }

  getDescription() { return this.description }
  getPreview() { return this.preview }

  // Setter
  setDeckType(type: deckType) { this.type = type }
  setDeckSubType(subType: deckSubType) { this.subType = subType }

  setStructureFailure(structureFailure: number) { this.structureFailure = structureFailure }
  setVisibility(visibility: number) { this.visibility = visibility; }
  setAirQuality(airQuality: number) { this.airQuality = airQuality; }
  setAccessibility(accessibility: number) { this.accessibility = accessibility }
  setCondition(condition: number) { this.condition = condition }
  setLocation(location: LatLng) { this.location = location }
  setFireLocation(fireLocation: LatLng) { this.fireLocation = fireLocation }
  setFireRadius(fireRadius: LatLng) { this.fireRadius = fireRadius }
  setFireDistance(fireDistance: number) { this.fireDistance = fireDistance }
  
  setDescription(description: string) { this.description = description }
  setPreview(preview: File) { this.preview = preview }
}