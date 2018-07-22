import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AlbumService } from '../services/album.service';
import { Album } from '../models/model.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  createAlbumForm = new FormGroup({
    name: new FormControl(''),
    discoverable: new FormControl('')
  });

  constructor(private albumService: AlbumService) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.createAlbumForm.value)
    this.albumService.createAlbum(this.createAlbumForm.value)
  }

}
