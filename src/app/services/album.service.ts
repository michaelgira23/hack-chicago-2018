import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Album, DistanceAlbum } from '../models/album.model';
import { Injectable } from '@angular/core';
import { combineLatest, from, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LocationService } from '../services/location.service';
import { ImageService } from './image.service';

@Injectable({
	providedIn: 'root'
})
export class AlbumService {

	constructor(
		private db: AngularFireDatabase,
		private locationService: LocationService,
		private imageService: ImageService
	) {	}

	getAllAlbums() {
		return this.db.list<Album>('albums').snapshotChanges();
	}

	getAlbum(id: string) {
		return this.db.object<Album>(`albums/${id}`).valueChanges();
	}

	getAllAlbumsSorted() {
		return combineLatest(this.locationService.location$, this.getAllAlbums()).pipe<SnapshotAction<DistanceAlbum>[]>(
			map(([loc, refs]) => {
				for (const ref of refs) {
					const album = ref.payload.val();
					(album as DistanceAlbum).distance = this.locationService.getDistance(loc, album.location);
				}
				refs.sort((a, b) => (a.payload.val() as DistanceAlbum).distance - (b.payload.val() as DistanceAlbum).distance);
				return refs;
			})
		);
	}

	createAlbum(options: CreateAlbumOptions) {
		return this.locationService.location$.pipe(
			switchMap(location => {
				const album: Album = {
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
		return zip(images.map(this.imageService.uploadImage)).pipe(
			switchMap((refs: firebase.database.Reference[]) => {
				const ids: { [uid: string]: true } = {};
				for (const ref of refs) {
					ids[ref.key] = true;
				}
				return this.db.object<Album>(`albums/${id}/images`).update(ids);
			})
		);
	}

}

export interface CreateAlbumOptions {
	name: string;
	discoverable: boolean;
	passcode?: string;
}
