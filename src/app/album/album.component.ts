import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';
import { FormGroup, FormControl } from '@angular/forms';
import { saveAs } from 'file-saver';
import * as moment from 'moment';

@Component({
	selector: 'app-album',
	templateUrl: './album.component.html',
	styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {

	passcodeForm = new FormGroup({
		passcode: new FormControl('')
	});

	passcode = true;
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
				if (this.album.passcode.length === 0 || !this.album.privateView) {
					this.passcode = false;
				}
				console.log(this.album);
			},
			err => {
				console.log(err);
			}
		);
	}

	checkPasscode() {
		console.log(this.passcodeForm.value.passcode === this.album.passcode);
		if (this.passcodeForm.value.passcode === this.album.passcode) {
			this.passcode = false;
		}
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

	timeSince(date: Date | moment.Moment) {
		return moment(date).fromNow();
	}

}
