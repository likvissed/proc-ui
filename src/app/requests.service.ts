import { environment } from './../environments/environment';
import { Request } from './interfaces';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class RequestsService {
  constructor(
    private http: HttpClient
  ) {}

  // create(req: Request): <any> {
  //   console.log('VALID API', req)
  //   // return this.http.post(`${environment.fbDBUrl}/posts.json`, post)
  //   //   .pipe(map((response: FbCreateResponse) => {  // map позволяет трансформировать данные из стрима
  //   //     const newPost: Post = {
  //   //         ...post,  // оператор spred для объекта post
  //   //         id: response.name,
  //   //         date: new Date(post.date)
  //   //     } // не помогло  as Post (ненужно)

  //   //     return newPost
  //   //   }))
  // }
  valid(req: Request): Observable<Request> {
    return this.http.post<Request>(`${environment.serverUrl}/requests`, req)
  }

}
