import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { AlbumComponent } from './album/album.component';

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
		path: '**',
		redirectTo: '/'
	}
];

export const appRoutingProviders: any[] = [
// 	AuthGuard,
// 	CanDeactivateGuard
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
