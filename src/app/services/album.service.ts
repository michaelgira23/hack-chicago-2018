import { AngularFireDatabase } from 'angularfire2/database';
import { Album } from '../models/album.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private db: AngularFireDatabase) { }

  getAllAlbums() {
    return this.db.list<Album>('albums').valueChanges();
  }

  createAlbum(album: CreateAlbumOptions) {
    album.created = firebase.database.ServerValue.TIMESTAMP;
    return this.db.list<Album>('albums').push(album);
  }

}

export interface CreateAlbumOptions {
  name: string;
  discoverable: boolean;
}
