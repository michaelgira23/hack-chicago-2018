import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../services/album.service';
import { DistanceAlbum } from '../models/album.model';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
