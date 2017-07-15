import { Injectable } from '@angular/core';

import { StorageService } from './angular2-http-storage.service';

class JwtHelper {

    static CHARS: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

    private static urlBase64Decode(str: string): string {
        let output = str.replace(/-/g, '+').replace(/_/g, '/');

        switch (output.length % 4) {
            case 0: { break; }
            case 2: { output += '=='; break; }
            case 3: { output += '='; break; }
            default: {
                throw 'Illegal base64url string!';
            }
        }

        return this.b64DecodeUnicode(output);
    }

    private static b64DecodeUnicode(str: any) : string {
        return decodeURIComponent(Array.prototype.map.call(this.b64decode(str), (c: any) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    private static b64decode(str: string): string {
        let output: string = '';
        
        str = String(str).replace(/=+$/, '');
        
        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        
        for (
            // initialize result and counters
            let bc: number = 0, bs: any, buffer: any, idx: number = 0;
            // get next character
            buffer = str.charAt(idx++);
            // character found in table? initialize bit storage and add its ascii value;
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
        ) {
            // try to find character in table (0-63, not found => -1)
            buffer = this.CHARS.indexOf(buffer);
        }
        
        return output;
    }

    public static decodeToken(token: string): any {
        let parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        
        let decoded = this.urlBase64Decode(parts[1]);
        
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        
        return JSON.parse(decoded);
    }    
}

@Injectable()
export class AuthService {
    
    constructor(private storage: StorageService) {

    }

    public setToken(token: string) : void {
        if (!this.isTokenExpired(token)) {
            this.storage.setToken(token);
        }
    }

    public removeToken() : void {
        this.storage.removeToken();
    }

    public isLoggedIn() : boolean {
        return this.storage.getToken() && !this.isTokenExpired();
    }

    public getUsername() : string {
        return this.getTokenProperty('unique_name');
    }

    public getTokenProperty(property:string) : any {
        if (!this.isLoggedIn()) {
            return undefined;
        }        

        return this.decodeToken()[property];
    }

    public hasClaim(claimType:string, claimValue:string) : boolean {
        let value = this.getTokenProperty(claimType);

        if (Array.isArray(value)) {
            return value.indexOf(claimValue) >= 0;
        } else {
            return value === claimValue;
        }
    }
        
    private decodeToken(token?: string) : any {
        return JwtHelper.decodeToken(token || this.storage.getToken());
    }
    
    private isTokenExpired(token?: string): boolean {
        let date = this.getTokenExpirationDate(token);    
        
        if (!date) {
            return false;
        }

        // Token expired?
        return date.valueOf() <= new Date().valueOf();
    }

    private getTokenExpirationDate(token?: string): Date {
        let decoded = this.decodeToken(token);

        if (!decoded.exp) {
            return null;
        }

        let date = new Date(0);
        date.setUTCDate(decoded.exp);
        return date;
    }
}