import { Location } from './location.model';

export interface Album {
	shortCode: string;
	images: { [timestamp: number]: string };
	passcode: string;
	location: Location;
	created: Date;
	name: string;
	discoverable: boolean;
}

export interface DistanceAlbum extends Album {
	distance: number;
}
