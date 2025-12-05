import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SafeXsrfInterceptor implements HttpInterceptor {
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Validar que la URL no sea protocol-relative (//example.com)
    if (req.url.startsWith('//')) {
      console.warn('Protocol-relative URL detected. Converting to absolute URL.');
      const absoluteUrl = `${window.location.protocol}${req.url}`;
      req = req.clone({ url: absoluteUrl });
    }

    // Verificar si es una petición cross-origin
    try {
      const requestUrl = new URL(req.url, window.location.origin);
      const currentOrigin = window.location.origin;

      // Si es cross-origin, remover el token XSRF para prevenir leakage
      if (requestUrl.origin !== currentOrigin) {
        req = req.clone({
          headers: req.headers.delete('X-XSRF-TOKEN')
        });
      }
    } catch (error) {
      // Si la URL es relativa, es same-origin por defecto
      console.debug('Relative URL detected, treating as same-origin');
    }

    return next.handle(req);
  }
}
