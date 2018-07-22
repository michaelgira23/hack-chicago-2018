import { AngularFireDatabase } from 'angularfire2/database';
import { Album, DistanceAlbum } from '../models/album.model';
import { Injectable } from '@angular/core';
import { combineLatest, from, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LocationService } from '../services/location.service';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable({
	providedIn: 'root'
})
export class AlbumService {

	constructor(
		private db: AngularFireDatabase,
		private locationService: LocationService,
		private storage: AngularFireStorage
	) {	}

	getAllAlbums() {
		return this.db.list<Album>('albums').valueChanges();
	}

	getAlbum(shortCode: string) {
		return this.getAllAlbums().pipe<Album | undefined>(
			map(albums => albums.find(a => a.shortCode === shortCode))
		);
	}

	getAllAlbumsSorted() {
		return combineLatest(this.locationService.location$, this.getAllAlbums()).pipe<DistanceAlbum[]>(
			map(([loc, refs]) => {
				const newRefs = refs.map(r => {
					const newRef: Partial<DistanceAlbum> = Object.assign({}, r); // Clone
					newRef.distance = this.locationService.getDistance(loc, r.location);
					return newRef as DistanceAlbum;
				});
				newRefs.sort((a, b) => a.distance - b.distance);
				return newRefs;
			})
		);
	}

	createAlbum(options: CreateAlbumOptions) {
		return this.locationService.location$.pipe(
			switchMap(location => {
				const alphabetArr = 'abcdefghijklmnopqrstuvwxyz'.split('');
				let shortCode = '';
				for (let i = 0; i < 5; i++) {
					shortCode += alphabetArr[Math.floor(Math.random() * 26)];
				}
				const album: Album = {
					shortCode,
					name: options.name,
					discoverable: options.discoverable,
					created: firebase.database.ServerValue.TIMESTAMP as any,
					images: {},
					passcode: options.passcode || '',
					location
				};
				return from(this.db.list<Album>('albums').push(album).then());
			})
		);
	}

	addImagesToAlbum(id: string, images: File[]) {
		return zip<string>(images.map(image => {
			const fileRef = this.storage.ref(`${Date.now()}-${image.name}`);
			fileRef.put(image);

			return fileRef.getDownloadURL();
		})).pipe(
			switchMap(urls => {
				const urlMap: { [timestamp: number]: string } = {};
				for (const url of urls) {
					urlMap[Date.now()] = url;
				}
				return this.db.object<Album>(`albums/${id}/images`).update(urlMap);
			})
		);
	}

}

export interface CreateAlbumOptions {
	name: string;
	discoverable: boolean;
	passcode?: string;
}
