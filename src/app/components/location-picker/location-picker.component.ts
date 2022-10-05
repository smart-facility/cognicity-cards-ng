import { Component, OnInit, Input } from '@angular/core';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { isEqual } from 'lodash';
// import * as L from 'leaflet'

import { DeckService } from '../../services/cards/deck.service';
import { MONUMEN_NASIONAL_LAT_LNG } from "../../../utils/const";
import { environment as env } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

declare let L

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Input() type: string
  @Input() searchText: string
  @Input() locateText: string
  provider: any
  map: any

  private currentMarker: any
  public latlng: { lat: string, lng: string }
  searchResults

  constructor(
    private deckService: DeckService,
    public translate: TranslateService
    ) { }

  ngOnInit() {
    this.deckService.userCannotBack()

    this.checkIsUserAbleToContinue()

    let { lat, lng } = MONUMEN_NASIONAL_LAT_LNG

    if (this.deckService.getLocation()) {
      lat = this.deckService.getLocation().lat
      lng = this.deckService.getLocation().lng
    }

    this.map = L.map('mapid', {
      center: [ lat, lng ],
      zoom: 16
    });

    const accessToken = env.mapbox_access_token;

    L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${accessToken}`, {
      attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomleft' })

    this.map.on('move', () => {
      this.addMarker()

      // User can click next button if user has move the map
      if (!isEqual(this.map.getCenter(), { lat, lng })) {
        this.deckService.userCanContinue()
      }
    })

    // If user not approve permission
    if (this.currentMarker) this.currentMarker.remove(this.map)
    this.addMarker()

    const locate = L.control.locate({ icon: 'locate', keepCurrentZoomLevel: true, strings: {title: this.locateText} }).addTo(this.map);
    locate.start()

    this.map.addControl(new L.Control.Compass());
    this.map.on('locationfound ', (event) => {
      if (this.currentMarker) this.currentMarker.remove(this.map)
      this.addMarker()

      // If location already same, no net to disable it again
      if (isEqual(event.latlng, this.map.getCenter())) {
        this.deckService.userCannotContinue()
      }
    })

    this.provider = new OpenStreetMapProvider()
  }

  ngOnDestroy() {
    this.deckService.userCannotBack();
    this.deckService.userCannotContinue();
  }

  checkIsUserAbleToContinue() {
    // If user already move the map they can continue
    if (this.deckService.location) {
      this.deckService.userCanContinue()
    } else {
      this.deckService.userCannotContinue()
    }
  }

  async onSearch(query: string) {
    query = query + ", Australia";
    const results = await this.provider.search({ query });
    this.searchResults = results; //we send this to the child component search-location
  }

  async onConfirmSearch(query: string) {
    const results = await this.provider.search({ query });

    this.map.setView({ lat: results[0].y, lng: results[0].x }, 18)
    if (this.currentMarker) this.currentMarker.remove(this.map)

    const icon = L.icon({
      iconUrl: this.icon,
      iconSize: [57.2 / 2, 103.5 / 2],
      iconAnchor: [15, 50],
      popupAnchor: [-3, -76],
    });

    const marker = L.marker([results[0].y, results[0].x], { icon })

    this.latlng = { lat: results[0].y, lng: results[0].x }
    this.deckService.setLocation({ lat: results[0].y, lng: results[0].x })

    if (this.currentMarker) this.currentMarker.remove(this.map)
    marker.addTo(this.map)

    this.currentMarker = marker
  }

  private addMarker(): void {
    const icon = L.icon({
      iconUrl: this.icon,
      iconSize: [57.2 / 2, 103.5 / 2],
      iconAnchor: [15, 50],
      popupAnchor: [-3, -76],
    });

    const { lat, lng } = this.map.getCenter();

    const marker = L.marker([lat, lng], { icon })

    this.latlng = { lat, lng }
    this.deckService.setLocation({ lat, lng })

    if (this.currentMarker) this.currentMarker.remove(this.map)
    marker.addTo(this.map)

    this.currentMarker = marker
  }

  get icon() {
    switch (this.type) {
      case 'flood':
        return '../../../assets/decks/flood/AddFloodIcon_Location.png'
      case 'structure':
        return '../../../assets/decks/earthquake/eqlocation/AddStructureFailureIcon_Location.png'
      case 'road':
        return '../../../assets/decks/earthquake/eqlocation/AddAccessReportIcon_Location.png'
      case 'wind':
        return '../../../assets/decks/wind/windlocation/Wind_Pin.png'
      case 'volcano':
        return '../../../assets/decks/volcano/location/Select_Report_Location.png'
      case 'haze':
        return '../../../assets/decks/fire/location/SelectHazeLocation.png';
      default:
        return '../../../assets/decks/fire/location/SelectHazeLocation.png';
    }
  }
}
