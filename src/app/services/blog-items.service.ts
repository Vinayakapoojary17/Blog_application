import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BlogItemsService {
  itemsCollections:AngularFirestoreCollection<Item> | undefined ;
  items:Observable<Item[]> ;
  itemDoc:AngularFirestoreDocument<Item> | undefined;
  constructor( public angularFirestore:AngularFirestore ) { 
    // this.items = this.angularFirestore.collection<Item>('blog-collection').valueChanges();
    // this.itemsCollections = this.angularFirestore.collection('blog-collection', ref => ref.orderBy('title','asc'));
    this.itemsCollections = this.angularFirestore.collection('blog-collection');
    this.items = this.itemsCollections.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
    console.log(this.items)
  }

  getBlogItem(){
    return this.items;
  }

  postBlogItem(item:Item){
    console.log(item);
    this.itemsCollections?.add(item);
  }

  removeBlog(item:Item){
    this.itemDoc = this.angularFirestore.doc(`blog-collection/${item.id}`);
    this.itemDoc.delete();
  }

  updateBlog(item:Item){
    this.itemDoc = this.angularFirestore.doc(`blog-collection/${item.id}`);
    this.itemDoc.update(item);
  }
}


interface Item{
  id?:string;
  blogContent?:string;
  blogTitle?: string;
  date?:Date;
}