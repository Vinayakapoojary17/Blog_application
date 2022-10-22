import { Component, OnInit } from '@angular/core';
import { BlogItemsService } from '../services/blog-items.service';
@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {
  postedBlogData:any=[];
  constructor(public blogItemService:BlogItemsService) { }

  ngOnInit(): void {
    //to get posted blog from service page
    this.blogItemService.getBlogItem().subscribe(items => {
      this.postedBlogData = items;
    });
  }

}
