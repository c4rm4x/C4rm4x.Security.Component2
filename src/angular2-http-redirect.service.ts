import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

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
    
    constructor(private location: Location, private config?: RedirectConfig) {
        config = config || RedirectConfigDefaults;
    }

    public restore() : void {
        this.location.replaceState(this.redirectToUrlAfterLogin.url); // Remove "login" from history
    }

    public save() {
        if (this.config.pathToLogin.toLocaleLowerCase() !== this.location.path().toLocaleLowerCase()) {
            this.redirectToUrlAfterLogin.url = this.location.path();
            this.location.go(this.config.pathToLogin);
        }
    }
}