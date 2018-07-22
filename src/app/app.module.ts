import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { appRoutingProviders, routing } from './app.routing';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AlbumComponent } from './album/album.component';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
	declarations: [
		AppComponent,
		AlbumComponent,
		HomeComponent,
		CreateComponent,
		UploadComponent
	],
	imports: [
		BrowserModule,
		routing,
		ReactiveFormsModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireStorageModule,
		HttpClientModule,
		BrowserAnimationsModule
	],
	providers: [appRoutingProviders],
	bootstrap: [AppComponent]
})
export class AppModule {
}
