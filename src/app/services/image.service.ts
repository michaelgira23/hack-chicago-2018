import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';
import { Image } from '../models/image.model';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';

@Injectable({
	providedIn: 'root'
})
export class ImageService {

	constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) {
	}

	uploadImage(image: File) {
		const fileRef = this.storage.ref(`${Date.now()}-${image.name}`);
		const task = fileRef.put(image);

		return fileRef.getDownloadURL().pipe<AngularFireList<Image>>(
			switchMap(url => this.db.list<Image>('images').push({
				link: url,
				created: firebase.database.ServerValue.TIMESTAMP as any
			}))
		);
	}

}
