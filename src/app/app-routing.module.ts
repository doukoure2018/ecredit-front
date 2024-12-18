import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ResetpasswordComponent } from './components/resetpassword/resetpassword.component';
import { VerifyComponent } from './components/verify/verify.component';
import { AuthenticationGuard } from './guard/authentication.guard';
import { PersonnephysiqueComponent } from './components/personnephysique/personnephysique.component';
import { ConfirmedcreditComponent } from './components/confirmedcredit/confirmedcredit.component';
import { DemandeindividuelComponent } from './components/demandeindividuel/demandeindividuel.component';
import { ListedemandeindividuelComponent } from './components/listedemandeindividuel/listedemandeindividuel.component';
import { StepcreditComponent } from './components/stepcredit/stepcredit.component';
import { PetitcreditComponent } from './components/petitcredit/petitcredit.component';
import { ChargeComponent } from './components/charge/charge.component';
import { VenteComponent } from './components/vente/vente.component';
import { FrequenceComponent } from './components/frequence/frequence.component';
import { GarantieComponent } from './components/garantie/garantie.component';
import { HomedaComponent } from './components/homeda/homeda.component';
import { HomeagentComponent } from './components/homeagent/homeagent.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'resetpassword',
    component: ResetpasswordComponent,
  },
  {
    path: 'secureapi/verify/account/:key',
    component: VerifyComponent,
  },
  {
    path: 'secureapi/verify/password/:key',
    component: VerifyComponent,
  },
  {
    path: 'confirmedCredit/:referencedcredit',
    component: ConfirmedcreditComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'charge/:referencedcredit',
    component: ChargeComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'vente/:referencedcredit',
    component: VenteComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'petitcredit/:referencedcredit',
    component: PetitcreditComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'frequence/:referencedcredit',
    component: FrequenceComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'garanties/:referencedcredit',
    component: GarantieComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'stepcreditIndividuel/:referencedcredit',
    component: StepcreditComponent,
    canActivate: [AuthenticationGuard],
  },

  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'demandes',
    component: ListedemandeindividuelComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'demande/:id/:codMembre',
    component: DemandeindividuelComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'personnep',
    component: PersonnephysiqueComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'homeda',
    component: HomedaComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'homeagent',
    component: HomeagentComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '**', component: HomeComponent, canActivate: [AuthenticationGuard] },
  { path: '', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
