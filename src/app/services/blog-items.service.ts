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
    this.itemsCollections = this.angularFirestore.collection('blog-collection');
    this.items = this.itemsCollections.snapshotChanges().pipe(map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Item;
        data.id = a.payload.doc.id;
        return data;
      })
    }));
  }

  // method to send blog collection item
  getBlogItem(){
    return this.items;
  }

  // method to create firebase blog collection item
  postBlogItem(item:Item){
    this.itemsCollections?.add(item);
  }

// method to delete firebase blog collection item
  removeBlog(item:Item){
    this.itemDoc = this.angularFirestore.doc(`blog-collection/${item.id}`);
    this.itemDoc.delete();
  }

// method to update firebase blog collection item
  updateBlog(item:Item){
    this.itemDoc = this.angularFirestore.doc(`blog-collection/${item.id}`);
    this.itemDoc.update(item);
  }
}

//interface data type foe blog collection
interface Item{
  id?:string;
  blogContent?:string;
  blogTitle?: string;
  date?:Date;
  imageUrl:string;
}