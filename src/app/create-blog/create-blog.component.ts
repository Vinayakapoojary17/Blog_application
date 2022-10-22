import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlogItemsService } from '../services/blog-items.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
declare var $:any;
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.css']
})
export class CreateBlogComponent implements OnInit {
  public blogForm:FormGroup;
  blogData:any=[];
  currentDate:string | undefined;
  editBlogData:any=[];
  snapshot:Observable<any> | undefined; // this does the image uploading 
  imageUrlfb: any;
  downloadURL: Observable<string> | undefined;
  uploadTask: AngularFireUploadTask | undefined; 
  imageUrl:any=[];
  loading: boolean = false;
  constructor(public formBuilder:FormBuilder, public blogItemService:BlogItemsService,private storage:AngularFireStorage, private db:AngularFirestore){ 
    // form data field 
    this.blogForm = this.formBuilder.group({
      blogTitle:[''],
      blogContent:['']
    })
  }

  async ngOnInit(): Promise<void> {
    //to get posted blog data from service
    this.blogItemService.getBlogItem().subscribe(items => {
      this.blogData = items;
      if(this.blogData.length == 0){
        this.openNewAddBlog();
      }
    });
    
  }

  onSubmit(){
    if(this.imageUrl.length==0){
      Swal.fire({
        icon: 'warning',
        title: 'Upload Blog Media',
      })
    }else{
      let todayDate = new Date();
      todayDate.setDate(todayDate.getDate());
      this.currentDate = ('0' + todayDate.getDate()).slice(-2) + '/' + ('0' + (todayDate.getMonth() + 1)).slice(-2) + '/' + todayDate.getFullYear(); //date format for blogId
      //data format to add Blog to database
      var data:any={
        blogId:'Blog_'+this.currentDate+'_'+this.blogData.length+1,
        title:this.blogForm.get('blogTitle')?.value,
        blogContent:this.blogForm.get('blogContent')?.value,
        creationDate:todayDate,
        imageURL:this.imageUrl
      }
      this.blogItemService.postBlogItem(data);   //sending data to service to add new blog
      //success message for data added to the collection
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Blog added successfully'
      })
      this.blogForm.reset();
      this.imageUrl=[];
    }
    
  }

  //Function to upload Blog media
  uploadImage(event:any) {
    var bcakgroundImgType=event.target.files[0].name;
    //validation for invalid file formate
    var fileExt = bcakgroundImgType.split('.').pop();
    //validation for blog image format
    if(fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "jfif" && fileExt !== "PNG"){
      Swal.fire("Invalid Image Format","","warning");
      return;
    }else{
      var imagePath=event.target.files[0];
      let safeName = imagePath.name.replace(/([^a-z0-9.]+)/gi, '');   // file name stripped of spaces and special chars
      let timestamp = Date.now();                                    
      const uniqueSafeName = timestamp + '_' + safeName;
      const path = 'uploads/' + uniqueSafeName;                       // Firebase storage path
      const ref = this.storage.ref(path);       
      this.loading=true;                      // reference to storage bucket
      this.uploadTask = this.storage.upload(path, imagePath);
      this.uploadTask.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL = ref.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.imageUrlfb = url;
              this.imageUrl=this.imageUrlfb;
              this.loading=false; 
            }
          });
        })
      ).subscribe();
    }
  }

  // function to open adding new blog workspace
  openNewAddBlog(){
    this.imageUrl=[];
    this.blogForm.reset();
    $('#addNew').css('display','block');
    $('#addNewBlog').css('display','block');
    $('#updateBlog').css('display','none');
    $('#post').css('display','block');
    $('#update').css('display','none');
  }

  // function to close blog workspace area
  cancel(){
    $('#addNew').css('display','none');
    this.imageUrl=[];
  }

  // method to send data to service to delete blog 
  deleteBlog(item:any){
    Swal.fire({   //confirmation alert to delete blog item
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.blogItemService.removeBlog(item);
        Swal.fire(
          'Deleted!',
          'Your Blog has been deleted.',
          'success'
        )
      }
    })
    // this.blogItemService.removeBlog(item);
  }

  // method to store data to edit blog 
  editBlog(item:any){
    this.blogForm.patchValue({blogTitle:item.title,blogContent:item.blogContent})
    this.editBlogData=item;
    this.imageUrl=item.imageURL;
    $('#addNew').css('display','block');
    $('#addNewBlog').css('display','none');
    $('#updateBlog').css('display','block');
    $('#post').css('display','none');
    $('#update').css('display','block');
    this.gotoTop();
  }

  updateBlogData(){
     //data format to edit Blog item
    var data:any={
      id:this.editBlogData.id,
      blogId:this.editBlogData.blogId,
      title:this.blogForm.get('blogTitle')?.value,
      blogContent:this.blogForm.get('blogContent')?.value,
      creationDate:this.editBlogData.creationDate,
      imageURL:this.imageUrl
    }
    this.blogItemService.updateBlog(data); //sending data to service to update new blog
    this.editBlogData=[];
    this.blogForm.reset();
    this.imageUrl=[];
  }


  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

}
