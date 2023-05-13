import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventPageComponent } from './pages/account/add-event-page/add-event-page.component';
import { AddMailingPageComponent } from './pages/account/add-mailing-page/add-mailing-page.component';
import { CheckinPageComponent } from './pages/account/checkin-page/checkin-page.component';
import { FavoritePageComponent } from './pages/account/favorite-page/favorite-page.component';
import { IexportPageComponent } from './pages/account/iexport-page/iexport-page.component';
import { MailingPageComponent } from './pages/account/mailing-page/mailing-page.component';
import { OrdersComponent } from './pages/account/orders/orders.component';
import { SettingsPageComponent } from './pages/account/settings-page/settings-page.component';
import { AuthComponent } from './pages/public/auth/auth.component';
import { BasketComponent } from './pages/public/basket/basket.component';
import { CheckoutComponent } from './pages/public/checkout/checkout.component';
import { EventDetailComponent } from './pages/public/event-detail/event-detail.component';
import { EventsListComponent } from './pages/public/events-list/events-list.component';
import {MainComponent} from "./pages/public/main/main.component";
import {RegistrationComponent} from "./pages/public/registration/registration.component";
import { SearchComponent } from './pages/public/search/search.component';
import { PromocodePageComponent } from './pages/account/promocode-page/promocode-page.component';
import { AddPromocodePageComponent } from './pages/account/add-promocode-page/add-promocode-page.component';
import { ReturnPageComponent } from './pages/account/return-page/return-page.component';
import { ReturnListPageComponent } from './pages/account/return-list-page/return-list-page.component';
import { SalesPageComponent } from './pages/account/sales-page/sales-page.component';
import { ReportPageComponent } from './pages/account/report-page/report-page.component';
import { StatisticPageComponent } from './pages/account/statistic-page/statistic-page.component';
import { StaticPageComponent } from './pages/public/static-page/static-page.component';
import { FaqPageComponent } from './pages/public/faq-page/faq-page.component';
import { FeedbackPageComponent } from './pages/public/feedback-page/feedback-page.component';
import { WithdrawalPageComponent } from './pages/account/withdrawal-page/withdrawal-page.component';
import { LoggingPageComponent } from './pages/account/admin/logging-page/logging-page.component';
import { PartnerPageComponent } from './pages/account/admin/partner-page/partner-page.component';
import { PartnerDetailPageComponent } from './pages/account/admin/partner-detail-page/partner-detail-page.component';
import { NewsPageComponent } from './pages/account/admin/news-page/news-page.component';
import { NewsDetailPageComponent } from './pages/account/admin/news-detail-page/news-detail-page.component';
import { SchemePageComponent } from './pages/account/admin/scheme-page/scheme-page.component';
import { SpecialPageComponent } from './pages/account/admin/special-page/special-page.component';
import { SpecialDetailPageComponent } from './pages/account/admin/special-detail-page/special-detail-page.component';
import { DesignPageComponent } from './pages/account/admin/design-page/design-page.component';
import { SlideDetailPageComponent } from './pages/account/admin/slide-detail-page/slide-detail-page.component';
import { BannerDetailPageComponent } from './pages/account/admin/banner-detail-page/banner-detail-page.component';
import { GenreDetailPageComponent } from './pages/account/admin/genre-detail-page/genre-detail-page.component';
import { RubricDetailPageComponent } from './pages/account/admin/rubric-detail-page/rubric-detail-page.component';
import { StatisticUserDetailPageComponent } from './pages/account/statistic-user-detail-page/statistic-user-detail-page.component';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { OrderFailComponent } from './pages/order-fail/order-fail.component';
import { ConfirmEmailComponent } from './pages/public/confirm-email/confirm-email.component';
import { RecoveryPageComponent } from './pages/public/recovery-page/recovery-page.component';
import { RecoverySecondPageComponent } from './pages/public/recovery-second-page/recovery-second-page.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent
  },
  {
    path: "signup",
    component: RegistrationComponent
  },
  {
    path: "auth",
    component: AuthComponent
  },
  {
    path: "search",
    component: SearchComponent
  },
  {
    path: "event/:detailId",
    component: EventDetailComponent
  },
  {
    path: "basket",
    component: BasketComponent,
  },
  {
    path: "orderSuccess",
    component: OrderSuccessComponent,
  },
  {
    path: "orderFail",
    component: OrderFailComponent,
  },
  {
    path: "confirmEmail",
    component: ConfirmEmailComponent,
  },
  {
    path: "recovery",
    component: RecoveryPageComponent,
  },
  {
    path: "recoverySecond",
    component: RecoverySecondPageComponent,
  },
  {
    path: "checkout",
    component: CheckoutComponent,
  },
  //категории мероприятий
  {
    path: "exhibition",
    component: EventsListComponent,
  },
  {
    path: "concert",
    component: EventsListComponent,
  },
  {
    path: "perfomance",
    component: EventsListComponent,
  },
  {
    path: "show",
    component: EventsListComponent,
  },
  {
    path: "children",
    component: EventsListComponent,
  },
  {
    path: "feedback",
    component: FeedbackPageComponent,
  },
  //страницы аккаунтов
  {
    path: "account",
    component: SettingsPageComponent,
  },
  {
    path: "account/favorite",
    component: FavoritePageComponent
  },
  // {
  //   path: "account/promotion",
  //   component: PromotionPageComponent
  // },
  {
    path: "account/orders",
    component: OrdersComponent
  },
  {
    path: "account/event",
    component: AddEventPageComponent
  },
  {
    path: "account/event/:event_id",
    component: AddEventPageComponent
  },
  {
    path: "account/checkin",
    component: CheckinPageComponent
  },
  {
    path: "account/iexport",
    component: IexportPageComponent
  },
  {
    path: "account/mailing",
    component: MailingPageComponent
  },
  {
    path: "account/mailing/add",
    component: AddMailingPageComponent
  },
  {
    path: "account/promocode",
    component: PromocodePageComponent
  },
  {
    path: "account/promocode/add",
    component: AddPromocodePageComponent
  },
  {
    path: "account/promocode/:id",
    component: AddPromocodePageComponent
  },
  {
    path: "account/return",
    component: ReturnPageComponent
  },
  {
    path: "account/return/:id",
    component: ReturnPageComponent
  },
  {
    path: "account/return-list",
    component: ReturnListPageComponent
  },
  {
    path: "account/sales",
    component: SalesPageComponent
  },
  {
    path: "account/report",
    component: ReportPageComponent
  },
  {
    path: "account/statistic",
    component: StatisticPageComponent
  },
  {
    path: "account/statistic/user/:id",
    component: StatisticUserDetailPageComponent
  },
  {
    path: "account/withdrawal",
    component: WithdrawalPageComponent
  },
  //admin
  {
    path: "account/design",
    component: DesignPageComponent
  },
  {
    path: "account/design/slider/add",
    component: SlideDetailPageComponent
  },
  {
    path: "account/design/slider/:id",
    component: SlideDetailPageComponent
  },
  {
    path: "account/design/banner/add",
    component: BannerDetailPageComponent
  },
  {
    path: "account/design/banner/:id",
    component: BannerDetailPageComponent
  },
  {
    path: "account/design/genre/add",
    component: GenreDetailPageComponent
  },
  {
    path: "account/design/genre/:id",
    component: GenreDetailPageComponent
  },
  {
    path: "account/design/rubric/add",
    component: RubricDetailPageComponent
  },
  {
    path: "account/design/rubric/:id",
    component: RubricDetailPageComponent
  },
  {
    path: "account/logging",
    component: LoggingPageComponent
  },
  {
    path: "account/partners",
    component: PartnerPageComponent
  },
  {
    path: "account/partners/:id",
    component: PartnerDetailPageComponent
  },
  {
    path: "account/news",
    component: NewsPageComponent
  },
  {
    path: "account/schemes",
    component: SchemePageComponent
  },
  {
    path: "account/specials",
    component: SpecialPageComponent
  },
  {
    path: "account/specials/add",
    component: SpecialDetailPageComponent
  },
  {
    path: "account/specials/:id",
    component: SpecialDetailPageComponent
  },
  {
    path: "account/news/add",
    component: NewsDetailPageComponent
  },
  {
    path: "account/news/:id",
    component: NewsDetailPageComponent
  },
  //статические страницы
  {
    path: "about",
    component: StaticPageComponent
  },
  {
    path: "public-offert",
    component: StaticPageComponent
  },
  {
    path: "return-bilet",
    component: StaticPageComponent
  },
  {
    path: "faq",
    component: FaqPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
