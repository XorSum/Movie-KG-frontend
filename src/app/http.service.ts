import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  public query(question: string): Observable<string> {
    const url = this.baseUrl + '/search/';
    const params = new HttpParams().set('question', question);
    const headers: HttpHeaders = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    return this.http.get<string>(url, {headers: headers, params: params})
      .pipe(catchError(this.handleError<string>('query', '')));
  }

  public getUrl(name: string): Observable<string> {
    const url_ = this.baseUrl + '/getUrl/';
    const params = new HttpParams().set('name', name);
    const headers: HttpHeaders = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    return this.http.get<string>(url_, {headers: headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }

  public getName(url: string): Observable<string> {
    const url_ = this.baseUrl + '/getName/';
    const params = new HttpParams().set('url', url);
    const headers: HttpHeaders = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    return this.http.get<string>(url_, {headers: headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }

  public getRelationTo(subject: string): Observable<string> {
    const url_ = this.baseUrl + '/relationTo/';
    const params = new HttpParams().set('subject', subject);
    const headers: HttpHeaders = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});
    return this.http.get<string>(url_, {headers: headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}
