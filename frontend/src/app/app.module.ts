import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalMessageComponent } from './components/global-message/global-message.component';
import { MainComponent } from './pages/public/main/main.component';
import { TopSliderComponent } from './components/public/main/top-slider/top-slider.component';
import { RegistrationComponent } from './pages/public/registration/registration.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import { AuthComponent } from './pages/public/auth/auth.component';
import { HeaderModule } from './components/public/header/header.module';
import { FooterModule } from './components/public/footer/footer.module';
import { BuyBtnComponent } from './components/global/buy-btn/buy-btn.component';
import { FilterBlockComponent } from './components/public/filter-block/filter-block.component';
import { MainSliderComponent } from './components/public/main/main-slider/main-slider.component';
import { EventDetailComponent } from './pages/public/event-detail/event-detail.component';
import { EventsListComponent } from './pages/public/events-list/events-list.component';
import { BottomBannerComponent } from './components/public/main/bottom-banner/bottom-banner.component';
import { EventBlockComponent } from './components/public/event-block/event-block.component';
import { SearchComponent } from './pages/public/search/search.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { FilterSearchBlockComponent } from './components/public/filter-search-block/filter-search-block.component';
import { ModalModule } from './components/modal/modal.module';
import { EventGalleryComponent } from './components/public/event-gallery/event-gallery.component';
import { FavoriteComponent } from './components/public/favorite/favorite.component';
import { BasketComponent } from './pages/public/basket/basket.component';
import { CheckoutComponent } from './pages/public/checkout/checkout.component';
import { CheckoutWrapModule } from './components/public/checkout-wrap/checkout-wrap.module';
import { BasketWrapModule } from './components/public/basket-wrap/basket-wrap.module';
import { ImageModule } from './components/image/image.module';
import { InputDateModule } from './components/input-date/input-date.module';
import { InputModule } from './components/input/input.module';
import { InputPhoneModule } from './components/input-phone/input-phone.module';
import { SidebarModule } from './components/public/sidebar/sidebar.module';
import { FavoritePageComponent } from './pages/account/favorite-page/favorite-page.component';
import { OrdersComponent } from './pages/account/orders/orders.component';
import { SettingsPageComponent } from './pages/account/settings-page/settings-page.component';
import { WrapAccountSettingsModule } from './pages/account/settings-page/children/wrap-account-settings/wrap-account-settings.module';
import { InputFileModule } from './components/input-file/input-file.module';
import { SelectModule } from './components/select/select.module';
import { AddEventPageComponent } from './pages/account/add-event-page/add-event-page.component';
import { WrapTabModule } from './pages/account/add-event-page/children/wrap-tab/wrap-tab.module';
import { InputCheckboxModule } from './components/input-checkbox/input-checkbox.module';
import { CheckinPageComponent } from './pages/account/checkin-page/checkin-page.component';
import { WrapIexportPageModule } from './pages/account/iexport-page/children/wrap-iexport-page/wrap-iexport-page.module';
import { IexportPageComponent } from './pages/account/iexport-page/iexport-page.component';
import { MailingPageComponent } from './pages/account/mailing-page/mailing-page.component';
import { WrapMailingPageModule } from './pages/account/mailing-page/children/mailing-page/wrap-mailing-page.module';
import { AddMailingPageComponent } from './pages/account/add-mailing-page/add-mailing-page.component';
import { WrapAddMailingPageModule } from './pages/account/add-mailing-page/children/wrap-add-mailing-page/wrap-add-mailing-page.module';
import { PromocodePageComponent } from './pages/account/promocode-page/promocode-page.component';
import { WrapPromocodePageModule } from './pages/account/promocode-page/children/wrap-promocode-page/wrap-promocode-page.module';
import { AddPromocodePageComponent } from './pages/account/add-promocode-page/add-promocode-page.component';
import { WrapAddPromocodePageModule } from './pages/account/add-promocode-page/children/wrap-add-promocode-page/wrap-add-promocode-page.module';
import { ReturnPageComponent } from './pages/account/return-page/return-page.component';
import { WrapReturnPageModule } from './pages/account/return-page/children/wrap-return-page/wrap-return-page.module';
import { ReturnListPageComponent } from './pages/account/return-list-page/return-list-page.component';
import { WrapReturnListPageModule } from './pages/account/return-list-page/children/wrap-return-list-page/wrap-return-list-page.module';
import { SalesPageComponent } from './pages/account/sales-page/sales-page.component';
import { WrapSalesPageModule } from './pages/account/sales-page/children/wrap-sales-page/wrap-sales-page.module';
import { ReportPageComponent } from './pages/account/report-page/report-page.component';
import { WrapReportPageModule } from './pages/account/report-page/children/wrap-report-page/wrap-report-page.module';
import { StatisticPageComponent } from './pages/account/statistic-page/statistic-page.component';
import { WrapStatisticPageModule } from './pages/account/statistic-page/children/wrap-statistic-page/wrap-statistic-page.module';
import { StaticPageComponent } from './pages/public/static-page/static-page.component';
import { FaqPageComponent } from './pages/public/faq-page/faq-page.component';
import { AccordionItemModule } from './pages/account/statistic-page/children/wrap-filter-product/children/accordion-filter-block/children/accordion-item/accordion-item.module';
import { WrapFeedbackPageModule } from './pages/public/feedback-page/children/wrap-feedback-page/wrap-feedback-page.module';
import { FeedbackPageComponent } from './pages/public/feedback-page/feedback-page.component';
import { WithdrawalPageComponent } from './pages/account/withdrawal-page/withdrawal-page.component';
import { WrapWithdrawalPageModule } from './pages/account/withdrawal-page/children/wrap-withdrawal-page/wrap-withdrawal-page.module';
import { LoggingPageComponent } from './pages/account/admin/logging-page/logging-page.component';
import { WrapLoggingPageModule } from './pages/account/admin/logging-page/children/wrap-logging-page/wrap-logging-page.module';
import { PartnerPageComponent } from './pages/account/admin/partner-page/partner-page.component';
import { PartnerDetailPageComponent } from './pages/account/admin/partner-detail-page/partner-detail-page.component';
import { WrapPartnerDetailPageModule } from './pages/account/admin/partner-detail-page/children/wrap-partner-detail-page/wrap-partner-detail-page.module';
import { WrapPartnerPageModule } from './pages/account/admin/partner-page/children/wrap-partner-page/wrap-partner-page.module';
import { NewsPageComponent } from './pages/account/admin/news-page/news-page.component';
import { NewsDetailPageComponent } from './pages/account/admin/news-detail-page/news-detail-page.component';
import { WrapNewsPageModule } from './pages/account/admin/news-page/children/wrap-news-page/wrap-news-page.module';
import { WrapNewsDetailPageModule } from './pages/account/admin/news-detail-page/children/wrap-news-detail-page/wrap-news-detail-page.module';
import { WrapPromocodeAdminPageModule } from './pages/account/promocode-page/children/wrap-promocode-admin-page/wrap-promocode-admin-page.module';
import { SpecialPageComponent } from './pages/account/admin/special-page/special-page.component';
import { WrapSpecialPageModule } from './pages/account/admin/special-page/children/wrap-special-page/wrap-special-page.module';
import { SchemePageComponent } from './pages/account/admin/scheme-page/scheme-page.component';
import { WrapSchemePageModule } from './pages/account/admin/scheme-page/children/wrap-scheme-page/wrap-scheme-page.module';
import { SpecialDetailPageComponent } from './pages/account/admin/special-detail-page/special-detail-page.component';
import { WrapSpecialDetailPageModule } from './pages/account/admin/special-detail-page/children/wrap-special-detail-page/wrap-special-detail-page.module';
import { WrapDesignPageModule } from './pages/account/admin/design-page/children/wrap-design-page/wrap-design-page.module';
import { DesignPageComponent } from './pages/account/admin/design-page/design-page.component';
import { SlideDetailPageComponent } from './pages/account/admin/slide-detail-page/slide-detail-page.component';
import { BannerDetailPageComponent } from './pages/account/admin/banner-detail-page/banner-detail-page.component';
import { GenreDetailPageComponent } from './pages/account/admin/genre-detail-page/genre-detail-page.component';
import { RubricDetailPageComponent } from './pages/account/admin/rubric-detail-page/rubric-detail-page.component';
import { WrapSlideDetilPageModule } from './pages/account/admin/slide-detail-page/children/wrap-slide-detil-page/wrap-slide-detil-page.module';
import { WrapBannerDetailPageModule } from './pages/account/admin/banner-detail-page/children/wrap-banner-detail-page/wrap-banner-detail-page.module';
import { WrapGenreDetailPageModule } from './pages/account/admin/genre-detail-page/children/wrap-genre-detail-page/wrap-genre-detail-page.module';
import { WrapRubricDetailPageModule } from './pages/account/admin/rubric-detail-page/children/wrap-rubric-detail-page/wrap-rubric-detail-page.module';
import { StatisticUserDetailPageComponent } from './pages/account/statistic-user-detail-page/statistic-user-detail-page.component';
import { WrapStatisticUserDetilPageModule } from './pages/account/statistic-user-detail-page/children/wrap-statistic-user-detil-page/wrap-statistic-user-detil-page.module';
import { CheckoutBlockModule } from './components/public/checkout-block/checkout-block.module';
import { DateBuyModule } from './components/modal/children/modal-buy/children/date-buy/date-buy.module';
import { PaginationModule } from './components/global/pagination/pagination.module';
import { PromotionPageComponent } from './pages/account/promotion-page/promotion-page.component';
import { WrapPromotionPageModule } from './pages/account/promotion-page/children/wrap-promotion-page/wrap-promotion-page.module';
import { WrapAddPromotionPageModule } from './pages/account/add-promocode-page/children/wrap-add-promotion-page/wrap-add-promotion-page.module';
import { OrderSuccessComponent } from './pages/order-success/order-success.component';
import { OrderFailComponent } from './pages/order-fail/order-fail.component';
import { TelegramAuthComponent } from './components/auth/telegram-auth/telegram-auth.component';
import { VkAuthComponent } from './components/auth/vk-auth/vk-auth.component';
import { ConfirmEmailComponent } from './pages/public/confirm-email/confirm-email.component';
import { RecoveryPageComponent } from './pages/public/recovery-page/recovery-page.component';
import { RecoverySecondPageComponent } from './pages/public/recovery-second-page/recovery-second-page.component';
import { SmsRepeatModule } from './components/public/sms-repeat/sms-repeat.module';
import { InputTimeModule } from './components/input-time/input-time.module';
import { WrapCheckinPageModule } from './pages/account/checkin-page/children/wrap-checkin-page/wrap-checkin-page.module';
import { AngularYandexMapsModule, YaConfig } from 'angular8-yandex-maps';

const mapConfig: YaConfig = {
  apikey: 'b3b04bc5-d40c-4ab5-ba1b-e2f82304002b',
  lang: 'en_US',
};

@NgModule({
  declarations: [
    AppComponent,
    GlobalMessageComponent,
    MainComponent,
    TopSliderComponent,
    RegistrationComponent,
    AuthComponent,
    BuyBtnComponent,
    FilterBlockComponent,
    MainSliderComponent,
    EventDetailComponent,
    EventsListComponent,
    BottomBannerComponent,
    EventBlockComponent,
    SearchComponent,
    BreadcrumbsComponent,
    FilterSearchBlockComponent,
    EventGalleryComponent,
    FavoriteComponent,
    BasketComponent,
    CheckoutComponent,
    FavoritePageComponent,
    OrdersComponent,
    SettingsPageComponent,
    AddEventPageComponent,
    CheckinPageComponent,
    IexportPageComponent,
    MailingPageComponent,
    AddMailingPageComponent,
    PromocodePageComponent,
    AddPromocodePageComponent,
    ReturnPageComponent,
    ReturnListPageComponent,
    SalesPageComponent,
    ReportPageComponent,
    StatisticPageComponent,
    StaticPageComponent,
    FaqPageComponent,
    FeedbackPageComponent,
    WithdrawalPageComponent,
    LoggingPageComponent,
    PartnerPageComponent,
    PartnerDetailPageComponent,
    NewsPageComponent,
    NewsDetailPageComponent,
    SpecialPageComponent,
    SchemePageComponent,
    SpecialDetailPageComponent,
    DesignPageComponent,
    SlideDetailPageComponent,
    BannerDetailPageComponent,
    GenreDetailPageComponent,
    RubricDetailPageComponent,
    StatisticUserDetailPageComponent,
    PromotionPageComponent,
    OrderSuccessComponent,
    OrderFailComponent,
    TelegramAuthComponent,
    VkAuthComponent,
    ConfirmEmailComponent,
    RecoveryPageComponent,
    RecoverySecondPageComponent
  ],
  imports: [
    DateBuyModule,
    CheckoutBlockModule,
    InputCheckboxModule,
    WrapTabModule,
    SidebarModule,
    BrowserModule,
    AppRoutingModule,
    MatProgressBarModule,
    HttpClientModule,
    InputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HeaderModule,
    FooterModule,
    ModalModule,
    CheckoutWrapModule,
    SmsRepeatModule,
    ImageModule,
    BasketWrapModule,
    InputDateModule,
    InputPhoneModule,
    InputFileModule,
    SelectModule,
    AccordionItemModule,
    PaginationModule,
    InputTimeModule,
    //wrap-pages
    WrapPromotionPageModule,
    WrapAddPromotionPageModule,
    WrapAccountSettingsModule,
    WrapIexportPageModule,
    WrapMailingPageModule,
    WrapAddMailingPageModule,
    WrapPromocodePageModule,
    WrapAddPromocodePageModule,
    WrapReturnPageModule,
    WrapReturnListPageModule,
    WrapCheckinPageModule,
    WrapSalesPageModule,
    WrapReportPageModule,
    WrapStatisticPageModule,
    WrapFeedbackPageModule,
    WrapWithdrawalPageModule,
    WrapLoggingPageModule,
    WrapPartnerDetailPageModule,
    WrapPartnerPageModule,
    WrapNewsPageModule,
    WrapNewsDetailPageModule,
    WrapPromocodeAdminPageModule,
    WrapSpecialPageModule,
    WrapSpecialDetailPageModule,
    WrapSchemePageModule,
    WrapDesignPageModule,
    WrapSlideDetilPageModule,
    WrapBannerDetailPageModule,
    WrapGenreDetailPageModule,
    WrapRubricDetailPageModule,
    WrapStatisticUserDetilPageModule,
    AngularYandexMapsModule.forRoot(mapConfig)
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }
