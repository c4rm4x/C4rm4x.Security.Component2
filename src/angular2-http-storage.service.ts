import { Injectable } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

export class CookieConfig {
    public name: string;
    public ttl: number;
}

export class StorageConfig {
    public key: string;
    public cookie: CookieConfig;
}

export const CookieConfigDefaults : CookieConfig = {
    name: 'auth',
    ttl: 1
};

export const StorageConfigDefaults : StorageConfig = {
    key: 'token',
    cookie: CookieConfigDefaults
};

@Injectable()
export class StorageService {

    constructor(private config?: StorageConfig) {        
        config = config || StorageConfigDefaults;
    }

    public getToken() : string {
        let token = sessionStorage.getItem(this.config.key);

        if (!token && this.config.cookie) {
            token = Cookie.get(this.config.cookie.name);

            if (token) {
                sessionStorage.setItem(this.config.key, token);
            }
        }

        return token || '';
    }

    public setToken(token: string) : void {
        sessionStorage.setItem(this.config.key, token);

        if (this.config.cookie) {
            Cookie.set(this.config.cookie.name, token, this.config.cookie.ttl || 1);
        }
    }

    public removeToken() : void {
        if (sessionStorage.getItem(this.config.key)) {
            sessionStorage.removeItem(this.config.key);
        }
        
        if (this.config.cookie && Cookie.get(this.config.cookie.name)) {
            Cookie.delete(this.config.cookie.name);
        }
    }

}