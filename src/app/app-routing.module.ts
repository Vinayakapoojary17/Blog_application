import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { ViewBlogComponent  } from './view-blog/view-blog.component';
const routes: Routes = [
  { path:'',redirectTo:'/view-blog',pathMatch:'full' },
  { path:'create-blog',component:CreateBlogComponent },
  { path:'view-blog',component:ViewBlogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations:[]
})
export class AppRoutingModule { }
