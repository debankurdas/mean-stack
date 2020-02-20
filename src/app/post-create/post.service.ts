import { Router } from '@angular/router';
import {Post} from './model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class PostServices {
   private posts: Post[] = [];
   private postUpdated = new Subject<{posts: Post[], postCount: number}>();

    constructor(private http: HttpClient, private route: Router) {}

    private backEnd = environment.apiUril + '/posts/';
    //
    getPost(pageSize: number, currentPage: number) {
     const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`;
     this.http.get<{message: string, posts: any, maxCount: number}>
       (this.backEnd + queryParams)
       .pipe(map((postData) => {
          return{ posts: postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          count: postData.maxCount
        };
       }))
       .subscribe((transformPostData) => {
         console.log(transformPostData);
         this.posts = transformPostData.posts;
         this.postUpdated.next({ posts: [...this.posts], postCount: transformPostData.count});
       });
    }
    getPostUpdateListner() {
      return this.postUpdated.asObservable();
    }
    getPostById(id: string) {
      return this.http.get<{_id: string , title: string, content: string, imagePath: string, creator: string}>(
        this.backEnd + id);
    }

    addPost(title: string, content: string, image: File) {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image);
      this.http.post<{message: string, post: Post}>(this.backEnd, postData)
      .subscribe((responseData) => {
        // const post: Post = {
        //   id: responseData.post.id ,
        //   title,
        //   content,
        //   imagePath: responseData.post.imagePath};
        // const response = responseData.message;
        // console.log(response);
        // this.posts.push(post);
        // this.postUpdated.next([...this.posts]);
        this.route.navigate(['/']);
      });

    }
    updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: Post | FormData;
      if (typeof image === 'object') {
        postData = new FormData();
        postData.append('id', id);
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
      } else {
        postData = {
          id,
          title,
          content,
          imagePath: image,
          creator: null
        };

      }
      this.http.put<{message: string}>(this.backEnd + id, postData)
      .subscribe(response => {
        // const updatedPost = [...this.posts];
        // const oldIndex = updatedPost.findIndex(p => p.id === id);
        // const post: Post = {
        //   id,
        //   title,
        //   content,
        //   imagePath,
        //   creator
        // };
        // console.log(post);
        // updatedPost[oldIndex] = post;
        // this.posts = updatedPost;
        // console.log(response);
        this.route.navigate(['/']);
      } );

    }
    deletePost(postId: string) {
     return this.http.delete(this.backEnd + postId);
      // .subscribe(() => {
      //   const updatePost = this.posts.filter(post => post.id !== postId);
      //   this.posts = updatePost;
      //   this.postUpdated.next([...this.posts]);
      // });
    }
}
