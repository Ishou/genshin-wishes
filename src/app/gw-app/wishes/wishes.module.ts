import { NgModule } from '@angular/core';
import { WishesComponent } from './wishes.component';
import { SharedModule } from '../../shared/shared.module';
import { WishCardComponent } from './wish-card/wish-card.component';
import { BannerNavComponent } from './banner-nav/banner-nav.component';
import { WishEmptyComponent } from './wish-empty/wish-empty.component';
import { WishFiltersComponent } from './wish-filters/wish-filters.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { WishNoResultComponent } from './wish-no-result/wish-no-result.component';

@NgModule({
  declarations: [
    WishesComponent,
    WishCardComponent,
    BannerNavComponent,
    WishEmptyComponent,
    WishFiltersComponent,
    WishListComponent,
    WishNoResultComponent,
  ],
  imports: [SharedModule],
  exports: [
    WishFiltersComponent,
    BannerNavComponent,
    WishEmptyComponent,
    WishNoResultComponent,
  ],
})
export class WishesModule {}