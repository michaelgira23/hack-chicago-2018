import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { routing, appRoutingProviders } from './app.routing';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { AlbumComponent } from './album/album.component';
import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';

@NgModule({
  declarations: [
    AppComponent,
    AlbumComponent,
    HomeComponent,
    CreateComponent
  ],
  imports: [
    BrowserModule,
    routing,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
