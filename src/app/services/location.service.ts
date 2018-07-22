import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getLocation(): Observable<Location> {
    return Observable.create(observer => {
      navigator.geolocation.getCurrentPosition(
        position => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        error => {
          observer.error(error);
        }
      );
    });
  }

}
