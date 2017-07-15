import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule, RequestOptions, BaseRequestOptions, Headers, Http, XHRBackend } from '@angular/http';

import { StorageService, StorageConfig, CookieConfig } from './angular2-http-storage.service';
import { RedirectService, RedirectConfig } from './angular2-http-redirect.service';
import { AuthService } from './angular2-http-auth.service';
import { JwtHttp } from './angular2-http.service';

export class DefaultRequestOptions extends BaseRequestOptions {
  
  constructor() {
    super();  
    this.headers.set('Content-Type', 'application/json');
  }
}

export function jwtHttpFactory(
  backend: XHRBackend, defaultOptions: RequestOptions, 
  storage: StorageService, 
  redirect: RedirectService) {
  return new JwtHttp(backend, defaultOptions, storage, redirect);
}

@NgModule({
  imports: [HttpModule], 
  providers: [
    StorageService,
    RedirectService,
    AuthService,
    JwtHttp
  ]
})
export class Http2Module {
  public static forRoot(cookie: CookieConfig, storage: StorageConfig, redirect: RedirectConfig)
    : ModuleWithProviders {
    return {
      ngModule: Http2Module,
      providers: [
        StorageService,
        RedirectService,
        AuthService,
        { provide: CookieConfig, useValue: cookie },
        { provide: StorageConfig, useValue: storage },
        { provide: RedirectConfig, useValue: redirect },
        { provide: RequestOptions, useClass: DefaultRequestOptions },
        {
          provide: Http,
          useFactory: jwtHttpFactory,
          deps: [XHRBackend, RequestOptions, StorageService, RedirectService]
        }
      ]
    }
  };
}
