import { Location } from './location.model';

export interface Album {
	images: { [uid: string]: true };
	passcode?: string;
	location: Location;
	created: Date;
	name: string;
	discoverable: boolean;
}
