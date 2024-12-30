import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { HeadermobileComponent } from './components/headermobile/headermobile.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  withFetch,
} from '@angular/common/http';
import { CacheInterceptor } from './interceptors/cache.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { UserService } from './services/user.service';
import { TopbarComponent } from './components/topbar/topbar.component';
import { StepcreditComponent } from './components/stepcredit/stepcredit.component';
import { DemandeIndividuelService } from './services/individuel.service';
import { PersonnephysiqueComponent } from './components/personnephysique/personnephysique.component';
import { ConfirmedcreditComponent } from './components/confirmedcredit/confirmedcredit.component';
import { DemandeindividuelComponent } from './components/demandeindividuel/demandeindividuel.component';
import { ListedemandeindividuelComponent } from './components/listedemandeindividuel/listedemandeindividuel.component';
import { MaterialsModule } from './materials/materials.module';
import { PetitcreditComponent } from './components/petitcredit/petitcredit.component';
import { ChargeComponent } from './components/charge/charge.component';
import { VenteComponent } from './components/vente/vente.component';
import { FrequenceComponent } from './components/frequence/frequence.component';
import { GarantieComponent } from './components/garantie/garantie.component';
import { ActeComponent } from './components/acte/acte.component';
import { PersonnecautionComponent } from './components/personnecaution/personnecaution.component';
import { LocalisationComponent } from './components/localisation/localisation.component';
import { StatecreditComponent } from './components/statecredit/statecredit.component';
import { HomedaComponent } from './components/homeda/homeda.component';
import { HomeagentComponent } from './components/homeagent/homeagent.component';
import { MenudaComponent } from './components/menuda/menuda.component';
import { DetailcreditComponent } from './components/detailcredit/detailcredit.component';
import { NoteprofileComponent } from './components/noteprofile/noteprofile.component';
import { NoteanalyseComponent } from './components/noteanalyse/noteanalyse.component';
import { NotegarantieComponent } from './components/notegarantie/notegarantie.component';
import { AppreciationComponent } from './components/appreciation/appreciation.component';
import { ResultnoteComponent } from './components/resultnote/resultnote.component';
import { CreditviewComponent } from './components/creditview/creditview.component';
import { NoteviewComponent } from './components/noteview/noteview.component';
import { StatecreditconfirmedComponent } from './components/statecreditconfirmed/statecreditconfirmed.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeadermobileComponent,
    FooterComponent,
    MenuComponent,
    ResetpasswordComponent,
    VerifyComponent,
    ProfileComponent,
    TopbarComponent,
    StepcreditComponent,
    PersonnephysiqueComponent,
    ConfirmedcreditComponent,
    DemandeindividuelComponent,
    ListedemandeindividuelComponent,
    PetitcreditComponent,
    ChargeComponent,
    VenteComponent,
    FrequenceComponent,
    GarantieComponent,
    ActeComponent,
    PersonnecautionComponent,
    LocalisationComponent,
    StatecreditComponent,
    HomedaComponent,
    HomeagentComponent,
    MenudaComponent,
    DetailcreditComponent,
    NoteprofileComponent,
    NoteanalyseComponent,
    NotegarantieComponent,
    AppreciationComponent,
    ResultnoteComponent,
    CreditviewComponent,
    NoteviewComponent,
    StatecreditconfirmedComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, MaterialsModule],
  providers: [
    UserService,
    DemandeIndividuelService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
