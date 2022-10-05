import { Injectable, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';
import { DeckService } from './cards/deck.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private deckService: DeckService
    ) {}

  async checkOTL(stage, otl) {
    if (
      otl === 'error'
      || otl === 'thanks'
    ) {
      return true;
    }

    if (
      stage === 'dev'
      && otl === 'test123'
    ) {
      this.deckService.setCardLanguage('en');
      return true;
    }

    console.log('Unknown OTL');
    var is_unique = await this.checkUniqueId(otl);
    console.log(is_unique);
    return is_unique;
  }
  async checkUniqueId(unique_id): Promise<Boolean> {
    // prod environment
    var self = this;
    var error_settings;
    var is_unique = false;
    try {
      var responseData = await self.GetOTLuniqueness(unique_id);
      this.deckService.setCardLanguage(responseData.result.language);
      console.log(responseData);
      is_unique = true;
      if (responseData.result.received === true)
        is_unique = false;
    } catch (error) {
      console.log(error);
      is_unique = false;
    }
    return is_unique;
    // .map(response => response.json())
    // .subscribe(
    //   data => {
    //     console.log(data);
    //     is_unique = true;
    //     // if (data.result.received === true) {
    //     //   // card already exists
    //     //   // error_settings.msg = self.reportcard.locale.card_error_messages.already_received;
    //     //   return false;
    //     // } else {
    //     //   // populate network property of reportcard, accessed in thanks card
    //     //   // self.reportcard.network = msg.result.network;
    //     //   // proceed to first card
    //     //   return true;
    //     // }
    //   },
    //   err => { console.error(err) },
    //   () => {
    //     console.log('done checking uniqeid')
    //     return is_unique;
    //   }
    // );
  }
  GetOTLuniqueness(uniqueId): Promise<any> {
    return this.http.get(env.data_server + 'cards/' + uniqueId).toPromise();
  }
}
