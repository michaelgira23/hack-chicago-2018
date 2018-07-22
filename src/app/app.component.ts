import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, RouterEvent } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'app';

	flashIn = false;
	flashHidden = false;

	constructor(private router: Router) {}

	ngOnInit() {
		this.router.events.subscribe((
			(event: RouterEvent) => {
				if (event instanceof NavigationStart) {
					console.log(event);
					if (event.url === '/') {
						setTimeout(() => {
							this.flashHidden = false;
						}, 1000);
					} else {
						this.flashHidden = true;
						if (this.router.routerState.snapshot.url !== '') {
							this.flashIn = true;
							this.flashHidden = false;
							setTimeout(() => {
								this.flashIn = false;
								this.flashHidden = true;
							}, 500);
						}
					}
				}
			}
		));
	}
}
