import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../../core/models';

interface Item{
  item: Product,
  remise: number
}

@Component({
  selector: 'app-item-row',
  templateUrl: './item-row.component.html',
  styleUrls: ['./item-row.component.scss']
})
export class ItemRowComponent implements OnInit {
  @Input() item: Product;
  
  itemRemise = 0;
  
  @Output() remiseEvent: EventEmitter<Item>= new EventEmitter();
  @Output() addItemEvent: EventEmitter<Product>= new EventEmitter();
  @Output() removeItemEvent: EventEmitter<Product>= new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  formatImage(img: any): any {
    return "data:image/jpeg;base64," + img;
  }
  
  addItem(item: Product): void{
    this.addItemEvent.emit(item);
  }
  removeItem(item: Product): void{
    this.removeItemEvent.emit(item);
  }

  applyRemise(): void{
    this.remiseEvent.emit({item: this.item, remise: this.itemRemise});
  }

}
