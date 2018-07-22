import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

	album: Album;

	constructor(private route: ActivatedRouteSnapshot, private albumService: AlbumService) { }

	ngOnInit() {
		this.albumService.getAlbum(this.route.params['id']).subscribe(
			album => {
				this.album = album;
				console.log(this.album);
			},
			err => {
				console.log(err);
			}
		);
	}

}
