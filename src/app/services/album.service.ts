import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Album, DistanceAlbum } from '../models/album.model';
import { Injectable, Inject } from '@angular/core';
import { Observable, Subject, combineLatest, forkJoin, from, throwError, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
		private http: HttpClient
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
			...images.map(image => {
				// const fileRef = rootRef.child(`${Date.now()}-${image.name}`);
				// return from(fileRef.put(image).then(() => fileRef.getDownloadURL()));
				return this.observableToPromise(rootRef.child(`${Date.now()}-${image.name}`).put(image));
			})
		]).pipe(
			switchMap(([action, passMatch, ...uploadedImages]) => {
				console.log('hello?'); // TODO: This isn't firing :^)
				if (!passMatch) {
					throwError(new Error('Passcodes do not match!'));
				}

				const urlMap: { [timestamp: number]: string } = {};
				for (const uploadedImage of uploadedImages) {
					urlMap[Date.now()] = uploadedImage.metadata.downloadURLs[0];
				}
				return this.db.object(`albums/${(action as SnapshotAction<Album>).key}/images`).update(urlMap);
			})
		);
	}

	addImageToAlbum(file: File) {
		const rootRef = firebase.storage().ref();
		return this.observableToPromise(rootRef.child(`testeststest-${Date.now()}`).put(file));
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
				const jzip = new JSZip();
				const folder = jzip.folder('Photos');

				for (let i = 0; i < blobs.length; i++) {
					folder.file(urls[i], blobs[i]);
				}

				return jzip.generateAsync({ type: 'blob' });
			})
		);
	}

	checkPasscode(shortCode: string, passcode: string) {
		return this.getAlbum(shortCode).pipe<boolean>(
			map(a => a.passcode === passcode)
		);
	}

	private observableToPromise(promise): Observable<any> {

		const subject = new Subject<any>();

		promise
			.then(res => {
					subject.next(res);
					subject.complete();
				},
				err => {
					subject.error(err);
					subject.complete();
				});

		return subject.asObservable();
}

}

export interface CreateAlbumOptions {
	name: string;
	discoverable: boolean;
	passcode?: string;
}
