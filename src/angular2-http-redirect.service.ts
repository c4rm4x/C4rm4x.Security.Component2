import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

export class RedirectConfig {
    pathToLogin: string;
}

export const RedirectConfigDefaults: RedirectConfig = {
    pathToLogin: '/login'    
};

@Injectable()
export class RedirectService {
    
    private redirectToUrlAfterLogin = {
        url: '/'
    };
    
    constructor(
        private location: Location, private router: Router, 
        private config?: RedirectConfig) {
        config = config || RedirectConfigDefaults;
    }

    public restore() : void {
        this.router.navigate([this.redirectToUrlAfterLogin.url]);
    }

    public save() {
        if (this.config.pathToLogin.toLocaleLowerCase() !== this.location.path().toLocaleLowerCase()) {
            this.redirectToUrlAfterLogin.url = this.location.path();
            this.router.navigate([this.config.pathToLogin]);
        }
    }
}