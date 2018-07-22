import { AngularFireDatabase } from 'angularfire2/database';
import { Album } from '../models/album.model';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
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

  getAlbum(id: string) {
    return this.db.object<Album>(`albums/${id}`).valueChanges();
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

}

export interface CreateAlbumOptions {
  name: string;
  discoverable: boolean;
  passcode?: string;
}
