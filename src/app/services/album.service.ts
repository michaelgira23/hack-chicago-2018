import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Album, DistanceAlbum } from '../models/album.model';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, forkJoin, from, throwError, zip } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LocationService } from '../services/location.service';
import { AngularFireStorage } from 'angularfire2/storage';
import * as JSZip from 'jszip';
import { HttpClient } from '@angular/common/http';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';

@Injectable({
	providedIn: 'root'
})
export class AlbumService {

	constructor(
		private db: AngularFireDatabase,
		private locationService: LocationService,
		private storage: AngularFireStorage,
		private http: HttpClient,
	) {	}

	getAllAlbums() {
		return this.db.list<Album>('albums').valueChanges();
	}

	getAlbumAction(shortCode: string) {
		return this.db.list<Album>(
			'albums', r => r.orderByChild('shortCode').equalTo(shortCode)
		).snapshotChanges().pipe<SnapshotAction<Album>>(
			map(actions => actions[0])
		);
	}

	getAlbum(shortCode: string) {
		return this.getAlbumAction(shortCode).pipe(
			map(action => action.payload.val())
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
				return from(this.db.list<Album>('albums').push(album).then())
					.pipe(map(() => album));
			})
		);
	}

	addImagesToAlbum(shortCode: string, passcode: string, images: File[]) {
		const rootRef = firebase.storage().ref();
		return zip([
			this.getAlbumAction(shortCode),
			this.checkPasscode(shortCode, passcode),
			...images.map(async image => {
					console.log('image');
					const fileRef = this.storage.ref(`${Date.now()}-${image.name}`);
					// await new Promise(resolve => {
					// 	fileRef.put(image).then(() => {
					// 		console.log('puts it');
					// 		resolve();
					// 	});
					// });
					// return fileRef.put(image).pipe(
					// 	switchMap(() => fileRef.getDownloadURL())
					// );

					const task = fileRef.put(image);

					return Observable.create(observer => {
						task.snapshotChanges().pipe(
							tap(() => console.log('bbe like but it do')),
							finalize(() => {
								console.log('finalize');
								observer.next(fileRef.getDownloadURL());
								observer.complete();
							})
						);
					});

					// return task.task.
					// return (task as any).getDownloadURL();
			})
		]).pipe(
			switchMap(([action, passMatch, ...urls]) => {
				console.log('test');
				if (!passMatch) {
					throwError(new Error('Passcodes do not match!'));
				}

				const urlMap: { [timestamp: number]: string } = {};
				for (const url of urls) {
					urlMap[Date.now()] = url as string;
				}
				return this.db.object(`albums/${(action as SnapshotAction<Album>).key}/images`).update(urlMap);
			})
		);
	}

	downloadAllImagesZip(shortCode: string) {
		let albumName: string;
		const urls: string[] = [];

		return this.getAlbum(shortCode).pipe(
			switchMap(album => {
				albumName = album.name;
				return forkJoin(Object.values(album.images).map(url => {
					urls.push(url);
					return this.http.get(url, { responseType: 'blob' });
				}));
			}),
			switchMap(blobs => {
				const jszip = new JSZip();
				const folder = jszip.folder('Photos');

				for (let i = 0; i < blobs.length; i++) {
					folder.file(urls[i], blobs[i]);
				}

				return jszip.generateAsync({ type: 'blob' });
			})
		);
	}

	checkPasscode(shortCode: string, passcode: string) {
		return this.getAlbum(shortCode).pipe<boolean>(
			map(a => a.passcode === passcode)
		);
	}

}

export interface CreateAlbumOptions {
	name: string;
	discoverable: boolean;
	passcode?: string;
}
