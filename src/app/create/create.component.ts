import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/album.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createAlbumForm = new FormGroup({
    name: new FormControl(''),
    discoverable: new FormControl(true)
  });

  constructor(private albumService: AlbumService) { }

  ngOnInit() {
  }

  onSubmit() {
	this.albumService.createAlbum(this.createAlbumForm.value).subscribe(
		ref => {
			console.log('created new album');
		},
		err => {
			console.log(err);
		}
	);
  }

}
