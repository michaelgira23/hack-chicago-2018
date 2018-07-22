import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        path: 'album/:id',
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