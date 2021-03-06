import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs-compat/add/operator/first';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

	@ViewChild('pictures') picturesInput: ElementRef;

	uploading = false;
	album: Album;
	files: any;

	passcodeForm = new FormGroup({
		passcode: new FormControl('')
	});

	requirePasscode = false;

	constructor(private route: ActivatedRoute, private albumService: AlbumService, private db: AngularFireDatabase) { }

	ngOnInit() {
		this.albumService.getAlbum(this.route.snapshot.params['shortCode']).subscribe(
			album => {
				this.album = album;
				console.log(album);
				if (!this.album.privateView) {
					this.requirePasscode = true;
				}
			},
			err => {
				console.log(err);
			}
		);
	}

	upload() {
		const files = Array.from<File>(this.picturesInput.nativeElement.files);
		if (files.length < 1) {
			return;
		}
		this.uploading = true;

		this.albumService.addImageToAlbum(this.album.shortCode, '', files).subscribe((url) => {
			console.log('upload image success', url);
			this.uploading = false;
			this.picturesInput.nativeElement.value = null;
		});
	}

	checkPasscode() {
		if (this.passcodeForm.value.passcode === this.album.passcode) {
			this.requirePasscode = false;
		}
	}

}
