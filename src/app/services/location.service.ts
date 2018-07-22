import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Location } from '../models/location.model';

@Injectable({
	providedIn: 'root'
})
export class LocationService {

	location$ = new BehaviorSubject<Location>({ longitude: 0, latitude: 0 });

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

	getDistance(first: Location, second: Location) {
		const latDiff = first.latitude - second.latitude;
		const longDiff = first.longitude - second.longitude;

		const avgLat = (first.latitude + second.latitude) / 2;
		const latOffset = latDiff * 111111 * Math.cos(avgLat * (Math.PI / 180));
		const longOffset = longDiff * 111111;

		return Math.hypot(latOffset, longOffset);
	}

}
