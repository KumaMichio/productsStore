import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  subscribe(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/newsletter/subscribe`, { email });
  }
}
