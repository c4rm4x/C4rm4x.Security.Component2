import { Injectable } from '@angular/core';
import { Http, ConnectionBackend, Request, RequestOptions, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { StorageService } from './angular2-http-storage.service';
import { RedirectService } from './angular2-http-redirect.service';

@Injectable()
export class JwtHttp extends Http {

    constructor(
        backend: ConnectionBackend, defaultOptions: RequestOptions, 
        private storage: StorageService, 
        private redirect: RedirectService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        if (typeof url === "string") {
            return this.get(url, options); // Recursion: transform url from String to Request
        }

        return this.requestWithToken(url as Request, options, this.storage.getToken());
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.get(url, options);
    }
    
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.post(url, body, options);
    }
    
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return super.put(url, body, options);
    }
    
    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.delete(url, options);
    }
    
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.patch(url, body, options);
    }
    
    head(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.head(url, options);
    }
    
    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return super.options(url, options);
    }

    private requestWithToken(request: Request, options?: RequestOptionsArgs, token?: string): Observable<Response> {
        if (token) {
            request.headers.set("Authorization", token);
        }

        return super
            .request(request, options)
            .catch((error: any) => {
                if (error.status === 401) {
                    this.redirect.save();
                }

                return Observable.throw(error);
            });
    }
}