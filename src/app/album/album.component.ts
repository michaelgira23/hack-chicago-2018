import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { saveAs } from 'file-saver';

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

	album: Album;
	imageKeys: string[] = [];

	constructor(private route: ActivatedRoute, private albumService: AlbumService) { }

	ngOnInit() {
		this.albumService.getAlbum(this.route.snapshot.params['shortCode']).subscribe(
			album => {
				this.album = album;
				if (this.album) {
					this.imageKeys = Object.keys(album.images || []);
				} else {
					this.imageKeys = [];
				}
				console.log(this.album);
			},
			err => {
				console.log(err);
			}
		);
	}

	downloadZip() {
		this.albumService.downloadAllImagesZip(this.route.snapshot.params['shortCode']).subscribe(
			zipBlob => {
				saveAs(zipBlob, this.album.name.replace(/ /g, '-') + '.zip');
			},
			err => {
				console.log(err);
			}
		);
	}

}
