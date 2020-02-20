import { PostServices } from './post.service';
import { Post } from './model';
import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  constructor(public postService: PostServices , private route: ActivatedRoute) { }
  isLoading = false;
  imagePreview: string;
  form: FormGroup;
  posts: Post;
  private mode = 'create';
  private postId: string;
  ngOnInit() {
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]
      }),
      content : new FormControl(null, {validators: [Validators.required]
      }),
      image : new FormControl(null, {validators: [Validators.required]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPostById(this.postId)
        .subscribe((postData) => {
          this.isLoading = false;
          this.posts = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({title: this.posts.title, content: this.posts.content, image: this.posts.imagePath});
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
  filegetter(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // tslint:disable-next-line: no-unused-expression
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    if (this.mode === 'create') {
      this.isLoading = true;
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else  {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }
    this.form.reset();
  }
}
