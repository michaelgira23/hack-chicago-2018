import { AngularFireDatabase, SnapshotAction } from 'angularfire2/database';
import { Album } from '../models/album.model';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private db: AngularFireDatabase, private locationService: LocationService) { }

  getAllAlbums() {
    return this.db.list<Album>('albums').snapshotChanges().pipe<SnapshotAction<Album>[]>(
      tap(refs => {
          refs.sort((a, b) => this.locationService.getDistance(a.payload.val().location, b.payload.val().location));
      })
    );
  }

  createAlbum(options: CreateAlbumOptions) {
    return this.locationService.getLocation().pipe(
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

}

export interface CreateAlbumOptions {
  name: string;
  discoverable: boolean;
  passcode?: string;
}
