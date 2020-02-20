import { AuthService } from './../auth/auth.service';
import { PostServices } from './../post-create/post.service';
import { Post } from './../post-create/model';
import { Component, OnInit, OnDestroy} from '@angular/core';
import {Subscribable, Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  tokenAuthentication = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage = 1;
  creatorId: string;
  postPerpageOption = [1, 2, 5, 10];
   posts: Post[] = [];
   isLoading = false;
   private postSub: Subscription;
   private tokenListner: Subscription;
  constructor(public postService: PostServices, private authService: AuthService) { }


  /* posts = [{title: 'First Post', content: 'First Data'},
           {title: 'Second Post', content: 'Second Data'},
{title: 'Third Post', content: 'Third Data'}];*/

  ngOnInit() {
    this.postService.getPost(this.postPerPage, this.currentPage);
    this.isLoading = true;
    this.creatorId = this.authService.getCreatorId();
    this.postSub = this.postService.getPostUpdateListner().
    subscribe((postData: { posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });

    this.tokenAuthentication = this.authService.getTokenAuth();
    this.tokenListner = this.authService.getTokenauthListner()
    .subscribe((result) => {
      this.tokenAuthentication = result;
      this.creatorId = this.authService.getCreatorId();

    });
  }
  onChange(pageData: PageEvent) {
    this.currentPage = (pageData.pageIndex + 1);
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage, this.currentPage);
  }
  onDelete( postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId)
    .subscribe(() => {
      this.postService.getPost(this.postPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.tokenListner.unsubscribe();
  }

}
