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

  getDistance(first: Location, second: Location) {
    const latDiff = first.latitude - second.latitude;
    const longDiff = first.longitude - second.longitude;


    const avgLat = (first.latitude + second.latitude) / 2;
    const latOffset = latDiff * 111111 * Math.cos(avgLat * (Math.PI / 180));
    const longOffset = longDiff * 111111;

    return Math.hypot(latOffset, longOffset);
  }

}
