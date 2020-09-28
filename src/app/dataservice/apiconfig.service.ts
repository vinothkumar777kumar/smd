import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiconfigService {

  constructor(private http:HttpClient) {
    this.getConfigdata();

  }

  getConfigdata(): void {
    this.http.get<any>('assets/api.config.json').subscribe(res => {
        sessionStorage.setItem('api_url', res.apiurl);
        sessionStorage.setItem('web_apiurl', res.web_apiurl);
        sessionStorage.setItem('image_url', res.image_url);
        sessionStorage.setItem('user_image_url', res.user_image_url);
        sessionStorage.setItem('blog_image_url', res.blog_image);
        sessionStorage.setItem('testimo_image_url', res.testi_image);
        
        
      }
    );
  }
}
