import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

	location$ = new BehaviorSubject<Location>(null);

  constructor() {
	navigator.geolocation.getCurrentPosition(
        position => {
          this.location$.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          this.location$.error(error);
        }
      );
  }

}
