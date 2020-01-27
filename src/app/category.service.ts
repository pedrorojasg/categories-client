import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Category } from './category';
import { MessageService } from './message.service';


const httpOptions = {
    headers: new HttpHeaders({
       'Content-Type': 'application/json',
       'Accept': 'application/json'
    })
};

@Injectable({ providedIn: 'root' })
export class CategoryService {

  private CategoriesUrl = 'http://localhost:8888/categories';  // URL to web api

  constructor(
      private http: HttpClient,
      private messageService: MessageService) { }

  /** GET Categories from the server */
  getCategories (): Observable<Category[]> {
    return this.http.get<any>(this.CategoriesUrl, httpOptions)
    .pipe(
        map(response=>response._embedded.categories),
        tap(_ => this.log('fetched Categories')),
        catchError(this.handleError<Category[]>('getCategories', []))
      );
  }

  /** GET category by id. Return `undefined` when id not found */
  getCategoryNo404<Data>(id: string): Observable<Category> {
    const url = `${this.CategoriesUrl}/?id=${id}`;
    return this.http.get<any>(url)
      .pipe(
        map(Categories => Categories[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} category id=${id}`);
        }),
        catchError(this.handleError<Category>(`getCategory id=${id}`))
      );
  }

  /** GET category by id. Will 404 if id not found */
  getCategory(id: string): Observable<Category> {
    const url = `${this.CategoriesUrl}/${id}`;
    return this.http.get<Category>(url).pipe(
      tap(_ => this.log(`fetched category id=${id}`)),
      catchError(this.handleError<Category>(`getCategory id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new category to the server */
  addCategory (category: Category): Observable<Category> {
    return this.http.post<Category>(this.CategoriesUrl, category, httpOptions).pipe(
      tap((newCategory: Category) => this.log(`added category w/ id=${newCategory.id}`)),
      catchError(this.handleError<Category>('addCategory'))
    );
  }

  /** DELETE: delete the category from the server */
  deleteCategory (category: Category): Observable<any> {
    const url = `${this.CategoriesUrl}/${category.id}`;

    return this.http.delete<Category>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted category id=${category.id}`)),
      catchError(this.handleError<Category>('deleteCategory'))
    );
  }

  /** PUT: update the category on the server */
  updateCategory (category: Category): Observable<any> {
    const url = `${this.CategoriesUrl}/${category.id}`;
    return this.http.put(url, category, httpOptions).pipe(
      tap(_ => this.log(`updated category id=${category.id}`)),
      catchError(this.handleError<any>('updateCategory'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      console.log(error.error.validation_messages);

      // TODO: better job of transforming error for user consumption
      this.log(
          `${operation} failed: ${JSON.stringify(error.error.validation_messages)}`,
          'error'
      );

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a CategoryService message with the MessageService 
   * 
   */
    private log(message: string, level: string = 'info') {
        this.messageService.add({
            text: `CategoryService: ${message}`,
            level: level
        });
    }
}
