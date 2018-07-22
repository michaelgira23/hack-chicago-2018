import { Location } from './location.model';

export interface Album {
	shortCode: string;
	images: { [timestamp: number]: string };
	passcode: string;
	location: Location;
	created: number;
	name: string;
	discoverable: boolean;
	privateView: boolean;
}

export interface DistanceAlbum extends Album {
	distance: number;
}
