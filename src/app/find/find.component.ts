import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { DistanceAlbum } from '../models/album.model';

@Component({
	selector: 'app-find',
	templateUrl: './find.component.html',
	styleUrls: ['./find.component.scss']
})
export class FindComponent implements OnInit {

	albums: DistanceAlbum[] = [];

	albumPhotoCounts: number[] = [];

	constructor(private albumService: AlbumService) {
	}

	ngOnInit() {
		this.albumService.getAllAlbumsSorted()
		.subscribe(
			albums => {
				this.albums = [];
				this.albumPhotoCounts = [];
				albums.forEach(album => {
					this.albums.push(album);
					this.albumPhotoCounts.push(Object.keys(album.images || []).length);
				});
			},
		);
	}

}
