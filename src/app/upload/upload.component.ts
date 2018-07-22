import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs-compat/add/operator/first';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

	@ViewChild('pictures') picturesInput: ElementRef;

	album: Album;
	files: any;

	constructor(private route: ActivatedRoute, private albumService: AlbumService, private db: AngularFireDatabase) { }

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
		console.log('files)', files);

		// it's a hackathon alright I don't care enough to do this properly
		for (const file of files) {
			// console.log('this.files', this.picturesInput.nativeElement.files);
			this.albumService.addImageToAlbum(this.album.shortCode, '', file).first().subscribe(([action, check, uploadedImage]) => {
				console.log('upload image success');

				if (!check) {
					console.log('oh no');
				}

				uploadedImage.ref.getDownloadURL()
					.then(url => {
						console.log('***url', url);

						return this.db.object(`albums/${action.key}/images`).update({ [Date.now()]: url });
					})
					.catch(err => console.log('help', err));
			});
		}
		// this.albumService.addImagesToAlbum(this.album.shortCode, '', files).subscribe(
		// 	() => {
		// 		console.log('success');
		// 	},
		// 	err => {
		// 		console.log('err', err);
		// 	}
		// );
	}

}
