import { AngularFireDatabase } from 'angularfire2/database';
import { Album } from '../models/album.model';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private db: AngularFireDatabase, private locationService: LocationService) { }

  getAllAlbums() {
    return this.db.list<Album>('albums').valueChanges();
  }

  createAlbum(options: CreateAlbumOptions) {
    return this.locationService.getLocation().pipe(
        switchMap(location => {
            const album: Album = {
                name: options.name,
                discoverable: options.discoverable,
                created: firebase.database.ServerValue.TIMESTAMP as any,
                images: {},
                passcode: options.passcode,
                location
            };
            return this.db.list<Album>('albums').push(album);
        })
    );
  }

}

export interface CreateAlbumOptions {
  name: string;
  discoverable: boolean;
  passcode?: string;
}
