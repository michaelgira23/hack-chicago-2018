import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { AlbumComponent } from './album/album.component';
import { UploadComponent } from './upload/upload.component';
import { FindComponent } from './find/find.component';

export const appRoutes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'create',
		component: CreateComponent
	},
	{
		path: 'album/:shortCode',
		component: AlbumComponent
	},
	{
		path: 'upload/:shortCode',
		component: UploadComponent
	},
	{
		path: 'find',
		component: FindComponent
	},
	{
		path: '**',
		redirectTo: '/'
	}
];

export const appRoutingProviders: any[] = [
// 	AuthGuard,
// 	CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
