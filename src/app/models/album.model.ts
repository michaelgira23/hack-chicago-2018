import { Location } from './location.model';

export interface Album {
	shortCode: string;
	images: { [uid: string]: true };
	passcode: string;
	location: Location;
	created: Date;
	name: string;
	discoverable: boolean;
}

export interface DistanceAlbum extends Album {
	distance: number;
}
