import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {RawData} from './raw-data';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl = environment.baseUrl;
  private headers: HttpHeaders = new HttpHeaders({'Content-type': 'application/x-www-form-urlencoded; charset=utf-8'});

  constructor(private http: HttpClient) {
  }

  public query(question: string): Observable<string> {
    const url = this.baseUrl + '/search/';
    const params = new HttpParams().set('question', encodeURIComponent(question));
    return this.http.get<string>(url, {headers: this.headers, params: params})
      .pipe(catchError(this.handleError<string>('query', '')));
  }

  public getUrl(name: string): Observable<string> {
    const url_ = this.baseUrl + '/getUrl/';
    const params = new HttpParams().set('name', encodeURIComponent(name));
    return this.http.get<string>(url_, {headers: this.headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }

  public getName(url: string): Observable<string> {
    const url_ = this.baseUrl + '/getName/';
    const params = new HttpParams().set('url', encodeURIComponent(url));
    return this.http.get<string>(url_, {headers: this.headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }

  public getRelationTo(subject: string): Observable<any> {
    const url_ = this.baseUrl + '/relationTo/';
    const params = new HttpParams().set('subject', encodeURIComponent(subject));
    return this.http.get<string>(url_, {headers: this.headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }

  public getRelationFrom(object: string): Observable<any> {
    const url_ = this.baseUrl + '/relationFrom/';
    const params = new HttpParams().set('object', encodeURIComponent(object));
    return this.http.get<string>(url_, {headers: this.headers, params: params})
      .pipe(catchError(this.handleError<string>('request', '')));
  }


  public getMovie(id: string | null, title: string | null): Observable<RawData> {
    const url = this.baseUrl + '/api/v3/movie/';
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    if (title != null) {
      params = params.set('title', title);
    }
   return this.http.get<RawData>(url, {headers: this.headers, params: params});
  }

  public getPerson(id: string | null, name: string | null): Observable<RawData> {
    const url = this.baseUrl + '/api/v3/person/';
    let params = new HttpParams();
    if (id != null) {
      params = params.set('id', id);
    }
    if (name != null) {
      params = params.set('name', name);
    }
    return this.http.get<RawData>(url, {headers: this.headers, params: params});
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - startName of the operation that failed
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
