import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	albums: Album[] = [];
	albumKeys: string[] = [];

	constructor(private albumService: AlbumService) {
	}

	ngOnInit() {
		this.albumService.getAllAlbumsSorted()
		.subscribe(
			actions => {
				this.albums = [];
				this.albumKeys = [];
				actions.forEach(action => {
					this.albumKeys.push(action.key);
					this.albums.push(action.payload.val());
					console.log(action.payload.val());
				});
			},
		);
	}

}
