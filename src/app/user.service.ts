import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}
  private cache: { [key: string]: any } = {}; // In-memory cache

  getAllUsers(page: number = 1, per_page: number = 6): Observable<any> {
    const cacheKey = `users_page_${page}_per_page_${per_page}`;
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]); // Return cached data if available
    } else {
      return this.http
        .get(`${this.baseUrl}?page=${page}&per_page=${per_page}`)
        .pipe(
          tap((data) => {
            this.cache[cacheKey] = data; // Cache the response
          })
        );
    }
  }
  getAllUsersForSearch(): Observable<any> {
    // Function to fetch all pages
    const fetchAllPages = (page: number = 1, per_page: number = 6): Observable<any> => {
      return this.getAllUsers(page, per_page).pipe(
        concatMap((response: any) => {
          // Check if there are more pages
          if (response.page < response.total_pages) {
            // Fetch the next page
            return fetchAllPages(response.page + 1, per_page).pipe(
              concatMap((nextResponse: any) => {
                // Combine the current page's data with the next pages' data
                return of({
                  ...response,
                  data: [...response.data, ...nextResponse.data],
                });
              })
            );
          } else {
            // No more pages, return the current page's data
            return of(response);
          }
        })
      );
    };

    const cacheKey = 'GetAllUsersForSearch';
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]); // Return cached data if available
    } else {
      return fetchAllPages().pipe(
        tap((data) => {
          this.cache[cacheKey] = data; // Cache the response
        })
      );
    }
  }
  getUserById(id: string) {
    const cacheKey = `user_${id}`;

    if (this.cache[cacheKey]) {      
      return of(this.cache[cacheKey]);
    } else {
      return this.http.get(`${this.baseUrl}/${id}`).pipe(
        tap((data) => {
          this.cache[cacheKey] = data;
        })
      );
    }
  }
}
