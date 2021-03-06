import {
  CollectionViewer,
  DataSource,
  ListRange,
} from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export class VirtualScrollDatasource<T> extends DataSource<T | undefined> {
  public _cachedData: T[] = Array.from<T>({ length: this._count });
  private _fetchedPages = new Set<number>();
  private _dataStream = new BehaviorSubject<(T | undefined)[]>(
    this._cachedData
  );
  private _subscriptions = [];
  private _currentRange!: ListRange;

  private _fetchRange = new Subject();
  private _destroy = new Subject();

  constructor(
    private _count: number,
    private _pageSize: number,
    private _fetchPageFn: (page: number) => Observable<T[]>
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(T | undefined)[]> {
    collectionViewer.viewChange
      .pipe(takeUntil(this._destroy))
      .subscribe((range) => {
        this._currentRange = range;
        this.fetchCurrentRange();
      });

    this._fetchRange
      .pipe(takeUntil(this._destroy), debounceTime(50))
      .subscribe(() => {
        const startPage = this._getPageForIndex(this._currentRange.start);
        const endPage = this._getPageForIndex(this._currentRange.end - 1);
        for (let i = startPage; i <= endPage; i++) {
          this._fetchPage(i);
        }
      });

    return this._dataStream;
  }

  disconnect(): void {
    this._destroy.next();
    this._destroy.complete();
  }

  update(count: number): void {
    this._fetchedPages = new Set<number>();
    this._cachedData = Array.from<T>({ length: count });
    this._dataStream.next(this._cachedData);
  }

  reset(): void {
    this._fetchedPages = new Set<number>();
    this._dataStream.next([]);
  }

  insertNew(count: number): void {
    const newPages = Math.ceil(count / this._pageSize);
    const oldPages = this._fetchedPages;
    this._cachedData.splice(
      0,
      0,
      ...Array.from<T>({ length: count })
    );
    this._dataStream.next(this._cachedData);

    this._fetchedPages = new Set<number>();
    oldPages.forEach((one) => {
      this._fetchedPages.add(one + newPages);
    });
    this.fetchCurrentRange();
  }

  private fetchCurrentRange(): void {
    this._fetchRange.next();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number): void {
    if (this._fetchedPages.has(page)) {
      return;
    }
    this._fetchedPages.add(page);

    this._fetchPageFn(page).subscribe((pageData) => {
      this._cachedData.splice(
        page * this._pageSize,
        pageData.length,
        ...pageData
      );
      this._dataStream.next(this._cachedData);
    });
  }
}
