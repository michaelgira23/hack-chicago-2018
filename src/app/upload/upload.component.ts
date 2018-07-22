import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

	@ViewChild('pictures') picturesInput: ElementRef;

	album: Album;
	files: any;

	constructor(private route: ActivatedRoute, private albumService: AlbumService) { }

	ngOnInit() {
		this.albumService.getAlbum(this.route.snapshot.params['shortCode']).subscribe(
			album => {
				this.album = album;
				console.log('albumerino', this.album);
			},
			err => {
				console.log(err);
			}
		);
	}

	upload() {
		const files = Array.from<File>(this.picturesInput.nativeElement.files);
		console.log('this.files', this.picturesInput.nativeElement.files);
		this.albumService.addImagesToAlbum(this.album.shortCode, '', files);
	}

}
