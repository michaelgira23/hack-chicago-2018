import { Location } from './location.model';

export interface Album {
	owners: { [uid: string]: true };
	images: { [uid: string]: true };
	location: Location;
	created: Date;
	name: string;
	discoverable: boolean;
}