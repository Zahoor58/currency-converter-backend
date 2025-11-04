import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  private baseUrl = environment.backendUrl + '/currency';

  constructor(private http: HttpClient) {}

  getLatest(base?: string): Observable<any> {
    let params = new HttpParams();
    if (base) params = params.set('base', base);
    return this.http.get(`${this.baseUrl}/latest`, { params })
      .pipe(catchError(this.handleError));
  }

  getHistorical(date: string, base?: string): Observable<any> {
    let params = new HttpParams().set('date', date);
    if (base) params = params.set('base', base);
    return this.http.get(`${this.baseUrl}/historical`, { params })
      .pipe(catchError(this.handleError));
  }

  getSymbols(): Observable<any> {
    return this.http.get(`${this.baseUrl}/symbols`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.error && typeof error.error === 'object') {
        if (error.error.details) {
          errorMessage = error.error.details;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Server error: ${error.status} - ${error.statusText}`;
        }
      } else {
        errorMessage = `Server error: ${error.status} - ${error.statusText}`;
      }
    }
    
    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}
