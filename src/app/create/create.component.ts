import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AlbumService } from '../services/album.service';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

	createAlbumForm = new FormGroup({
		name: new FormControl(''),
		discoverable: new FormControl(true),
		passcode: new FormControl('')
	});

	constructor(private router: Router, private albumService: AlbumService) {
	}

	ngOnInit() {
	}

	onSubmit() {
		this.albumService.createAlbum(this.createAlbumForm.value).subscribe(
			album => {
				this.router.navigate(['/upload', album.shortCode]);
			},
			err => {
				console.log(err);
			}
		);
	}

}
