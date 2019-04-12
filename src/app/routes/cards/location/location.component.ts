import { Component } from '@angular/core';
import { DeckService } from '../../../services/cards/deck.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  search: string = ''

  constructor(public deckService: DeckService) {}
}
