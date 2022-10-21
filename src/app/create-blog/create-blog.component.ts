import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BlogItemsService } from '../services/blog-items.service';
import { AngularFireStorage } from '@angular/fire/compat/storage'

declare var $:any;
@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  public blogForm:FormGroup;
  allUsers:any;
  adImage:any=[];
  blogData:any=[];
  imagePath:any;
  currentDate:string | undefined;
  blogUpdateData:any=[];
  // task:AngularFireUploadTask;
  // ref:AngularFireStorageReference; 
  constructor(  public formBuilder:FormBuilder, public router:Router, public blogItemService:BlogItemsService,private fs:AngularFireStorage ) { 
    this.blogForm = this.formBuilder.group({
      blogTitle:[''],
      blogContent:['']
    })
  }

  async ngOnInit(): Promise<void> {

    this.blogItemService.getBlogItem().subscribe(items => {
      console.log(items)
      this.blogData = items;
    });

    let myDate = new Date();
    myDate.setDate(myDate.getDate())
    this.currentDate = ('0' + myDate.getDate()).slice(-2) + '/' + ('0' + (myDate.getMonth() + 1)).slice(-2) + '/' + myDate.getFullYear();
  }
  onSubmit(){
    let myDate = new Date();
    console.log(myDate);

    var data:any={
      blogId:'Blog_'+this.currentDate+'_'+this.blogData.length+1,
      title:this.blogForm.get('blogTitle')?.value,
      blogContent:this.blogForm.get('blogContent')?.value,
      creationDate:myDate
    }
    this.blogItemService.postBlogItem(data);
    this.blogForm.reset();
  }
  uploadImage(event:any) {
    //pick from one of the 4 styles of file uploads below
    console.log(event);
    // const id=Math.random().toString(36).substring(2);
    // this.ref= th
    this.imagePath=event.target.files[0];
    this.fs.upload("/files"+Math.random()+this.imagePath,this.imagePath);
    console.log(this.imagePath)

  }

  openNewAddBlog(){
    $('#addNew').css('display','block');
  }

  deleteBlog(item:any){
    console.log(item)
    console.log(this.blogData[0])
    this.blogItemService.removeBlog(item);
  }

  editBlog(item:any){
    this.blogForm.patchValue({blogTitle:item.title,blogContent:item.blogContent})
    this.blogUpdateData=item;
    console.log(this.blogUpdateData)
    this.openNewAddBlog();
    // var item:any={
    //   title:this.blogForm.get('blogTitle')?.value,
    //   blogContent:this.blogForm.get('blogContent')?.value,
    // }
    // this.blogItemService.updateBlog(item);
  }

  updateBlogData(){
    var data:any={
      id:this.blogUpdateData.id,
      blogId:this.blogUpdateData.blogId,
      title:this.blogForm.get('blogTitle')?.value,
      blogContent:this.blogForm.get('blogContent')?.value,
      creationDate:this.blogUpdateData.creationDate
    }
    this.blogItemService.updateBlog(data);
    this.blogUpdateData=[];
    this.blogForm.reset();
  }


}
