import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { DistanceAlbum } from '../models/album.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	albums: DistanceAlbum[] = [];

	constructor(private albumService: AlbumService) {
	}

	ngOnInit() {
		this.albumService.getAllAlbumsSorted()
		.subscribe(
			albums => {
				this.albums = [];
				albums.forEach(action => {
					this.albums.push(action);
					console.log(action);
				});
			},
		);
	}

}
