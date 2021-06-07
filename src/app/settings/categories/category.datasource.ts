import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import {
  CategoryResponse,
  CategoryWem,
} from "../../core/models/category.response";
import { SettingsService } from "../../core/services";

export class CategoryDataSource implements DataSource<CategoryWem> {
  private categoriesSubject = new BehaviorSubject<CategoryWem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private settingService: SettingsService) {}

  connect(collectionViewer: CollectionViewer): Observable<CategoryWem[]> {
    return this.categoriesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.categoriesSubject.complete();
    this.loadingSubject.complete();
  }
 
  loadCategories(){
    this.loadingSubject.next(true);

    this.settingService.loadCategoryWithRelatedProducts().subscribe((res:CategoryResponse) => this.categoriesSubject.next(res.container.categories));
  }
}
