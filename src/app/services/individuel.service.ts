import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';
import {
  ActeState,
  AppreciationState,
  CantonState,
  ChargeIndState,
  ConfirmedCreditIndState,
  CreditState,
  CustomHttpResponse,
  DemandeState,
  DetailCreditIndState,
  DistrictState,
  FrequenceState,
  GarantieState,
  HomeState,
  LocalisationState,
  NoteAnalyseState,
  NoteGarantieState,
  NoteProfileState,
  NoteviewCreditState,
  PersonneCautionState,
  PersonnePState,
  PetitCreditState,
  ProduitIndState,
  ResultNoteState,
} from '../interfaces/appstates';
import { Individuel } from '../interfaces/individuel';
import { Credit } from '../interfaces/credit';
import { ConfirmedCreditInd } from '../interfaces/confirmed-credit-ind';
import { PetitCredit } from '../interfaces/petit-credit';
import { ChargesInd } from '../interfaces/charge-ind';
import { ProduitInd } from '../interfaces/produit-ind';
import { Frequence } from '../interfaces/frequence';
import { GarantieMatInd } from '../interfaces/garantiemat-ind';
import { Personnecaution } from '../interfaces/personne-caution';
import { Localisation } from '../interfaces/localisation';
import { NoteProfile } from '../interfaces/note-profile';
import { NoteAnalyse } from '../interfaces/note-analyse';
import { NoteGarantie } from '../interfaces/note-garantie';
import { Appreciation } from '../interfaces/appreciation';
import { ResultNote } from '../interfaces/result-note';

@Injectable({ providedIn: 'root' })
export class DemandeIndividuelService {
  private readonly server: string = 'http://127.0.0.1:8082/ecredit';

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  home$ = (): Observable<CustomHttpResponse<HomeState>> =>
    this.http.get<CustomHttpResponse<HomeState>>(`${this.server}/home`).pipe(
      tap((response) => console.log('API Response:', response)),
      catchError(this.handleError)
    );

  /**
   * Liste de toutes les demandes
   * Individuelles
   * @returns
   */
  listDemandeIndividuel$ = (): Observable<CustomHttpResponse<DemandeState>> =>
    this.http
      .get<CustomHttpResponse<DemandeState>>(
        `${this.server}/listDemandeIndividuel`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Get demande individuel by id
   * @param idDemandeIndividuel
   * @returns
   */
  demande$ = (
    idDemandeIndividuel: number,
    codMembre: string
  ): Observable<CustomHttpResponse<DemandeState>> =>
    this.http
      .get<CustomHttpResponse<DemandeState>>(
        `${this.server}/${idDemandeIndividuel}/${codMembre}/demandeIndividuel`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Ajout credit individuel
   * pour la confirmation
   * @param creditForm
   * @returns
   */
  addCreditIndividuel$ = (creditForm: Credit) =>
    <Observable<CustomHttpResponse<DemandeState>>>this.http
      .post<CustomHttpResponse<DemandeState>>(
        `${this.server}/addCreditIndividuel`,
        creditForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Confirmation Credit
   * @param referenceCredit
   * @returns
   */
  confirmedCredit$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<ConfirmedCreditIndState>> =>
    this.http
      .get<CustomHttpResponse<ConfirmedCreditIndState>>(
        `${this.server}/${referenceCredit}/newConfirmedCredit`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Add Confirmed CreditIndividuel
   * @param creditForm
   * @returns
   */
  addConfirmedCreditInd$ = (
    referenceCredit: string,
    confirmedCreditForm: ConfirmedCreditInd
  ) => <Observable<CustomHttpResponse<ConfirmedCreditIndState>>>this.http
      .post<CustomHttpResponse<ConfirmedCreditIndState>>(
        `${this.server}/${referenceCredit}/addConfirmedCredit`,
        confirmedCreditForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Analyse petit credit
   * @param referenceCredit
   * @returns
   */
  petitCredit$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<PetitCreditState>> =>
    this.http
      .get<CustomHttpResponse<PetitCreditState>>(
        `${this.server}/${referenceCredit}/newPetitCredit`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Add Analyse Petit Credit
   * @param creditForm
   * @returns
   */
  addPetitCredit$ = (referenceCredit: string, petitCreditForm: PetitCredit) =>
    <Observable<CustomHttpResponse<PetitCreditState>>>this.http
      .post<CustomHttpResponse<PetitCreditState>>(
        `${this.server}/${referenceCredit}/addPetitCredit`,
        petitCreditForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Analyse petit credit
   * @param referenceCredit
   * @returns
   */
  chargesInd$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<ChargeIndState>> =>
    this.http
      .get<CustomHttpResponse<ChargeIndState>>(
        `${this.server}/${referenceCredit}/chargesInd`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Add Analyse Petit Credit
   * @param chargeIndForm
   * @returns
   */
  addChargesInd$ = (referenceCredit: string, chargeIndForm: ChargesInd) =>
    <Observable<CustomHttpResponse<ChargeIndState>>>this.http
      .post<CustomHttpResponse<ChargeIndState>>(
        `${this.server}/${referenceCredit}/addChargeInd`,
        chargeIndForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Analyse petit credit
   * @param referenceCredit
   * @returns
   */
  produitInd$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<ProduitIndState>> =>
    this.http
      .get<CustomHttpResponse<ProduitIndState>>(
        `${this.server}/${referenceCredit}/produitInd`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Add Analyse Petit Credit
   * @param venteIndForm
   * @returns
   */
  addProduitInd$ = (referenceCredit: string, venteIndForm: ProduitInd) =>
    <Observable<CustomHttpResponse<ProduitIndState>>>this.http
      .post<CustomHttpResponse<ProduitIndState>>(
        `${this.server}/${referenceCredit}/addProduitInd`,
        venteIndForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * frequence de l'activité
   * @param referenceCredit
   * @returns
   */
  frequence$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<FrequenceState>> =>
    this.http
      .get<CustomHttpResponse<FrequenceState>>(
        `${this.server}/${referenceCredit}/frequence`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Add Analyse Petit Credit
   * @param venteIndForm
   * @returns
   */
  addFrequence$ = (referenceCredit: string, frequenceForm: Frequence) =>
    <Observable<CustomHttpResponse<FrequenceState>>>this.http
      .post<CustomHttpResponse<FrequenceState>>(
        `${this.server}/${referenceCredit}/addFrequence`,
        frequenceForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Garantie Materielle
   * @param referenceCredit
   * @returns
   */
  garantieMateriel$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<GarantieState>> =>
    this.http
      .get<CustomHttpResponse<GarantieState>>(
        `${this.server}/${referenceCredit}/garantiematnew`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Ajout Garantie Materielle
   * @param garantieMatForm
   * @returns
   */
  addGarantieMaterielle$ = (garantieMatForm: GarantieMatInd) =>
    <Observable<CustomHttpResponse<GarantieState>>>this.http
      .post<CustomHttpResponse<GarantieState>>(
        `${this.server}/addgarantiemat`,
        garantieMatForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Les actes de proprietes
   * @param referenceCredit
   * @returns
   */
  newActe$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<ActeState>> =>
    this.http
      .get<CustomHttpResponse<ActeState>>(
        `${this.server}/${referenceCredit}/newacte`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Ajout actes de proprietes
   * @param formData
   * @returns
   */
  addActe$ = (referenceCredit: string, formData: FormData) =>
    <Observable<CustomHttpResponse<ActeState>>>(
      this.http
        .post<CustomHttpResponse<ActeState>>(
          `${this.server}/${referenceCredit}/addacte`,
          formData
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Supprimer un acte de propriete
   * @returns
   */
  deleteActe$ = (id: number, referenceCredit: string) =>
    <Observable<CustomHttpResponse<ActeState>>>(
      this.http
        .delete<CustomHttpResponse<ActeState>>(
          `${this.server}/${id}/${referenceCredit}/delecteActe`
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * new garantie personne caution
   * @param referenceCredit
   * @returns
   */
  newgarantiepersonnecaution$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<PersonneCautionState>> =>
    this.http
      .get<CustomHttpResponse<PersonneCautionState>>(
        `${this.server}/${referenceCredit}/newGarantiePersonneCaution`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Localisation de l'associe
   * @param referenceCredit
   * @returns
   */
  newLocalisation$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<LocalisationState>> =>
    this.http
      .get<CustomHttpResponse<LocalisationState>>(
        `${this.server}/${referenceCredit}/newLocalisation`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Ajout nouvelle Localisation
   * @param localisationForm
   * @returns
   */
  addLocalisation$ = (localisationForm: Localisation) =>
    <Observable<CustomHttpResponse<LocalisationState>>>this.http
      .post<CustomHttpResponse<LocalisationState>>(
        `${this.server}/addLocalisation`,
        localisationForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Ajout garantie personne caution
   * @param formData
   * @returns
   */
  addPersonneCaution$ = (personnecautionForm: Personnecaution) =>
    <Observable<CustomHttpResponse<PersonneCautionState>>>this.http
      .post<CustomHttpResponse<PersonneCautionState>>(
        `${this.server}/addGarantiePersonneCaution`,
        personnecautionForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Information detaillee de credit
   *  Pour un membre
   * @param referenceCredit
   * @param codMembre
   * @returns
   */
  detailCreditCredit$ = (
    referenceCredit: string,
    codMembre: string
  ): Observable<CustomHttpResponse<DetailCreditIndState>> =>
    this.http
      .get<CustomHttpResponse<DetailCreditIndState>>(
        `${this.server}/${referenceCredit}/${codMembre}/detailCredit`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Display the whole note for the credit
   * @param referenceCredit
   * @returns
   */
  noteviewCredit$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<NoteviewCreditState>> =>
    this.http
      .get<CustomHttpResponse<NoteviewCreditState>>(
        `${this.server}/${referenceCredit}/noteviewCredit`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  /**
   * Adhesion personne Physique
   * @returns
   */
  personnep$ = (): Observable<CustomHttpResponse<PersonnePState>> =>
    this.http
      .get<CustomHttpResponse<PersonnePState>>(`${this.server}/add/new`)
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Get Info Individuel
   * @param codMembre
   * @returns
   */
  getindividuel$ = (
    codMembre: string
  ): Observable<CustomHttpResponse<Individuel>> =>
    this.http
      .get<CustomHttpResponse<Individuel>>(
        `${this.server}/${codMembre}/infoIndividuel`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Mise a jour du status pour le credit
   * @param referenceCredit
   * @returns
   */
  updateStatutCredit$ = (referenceCredit: string) =>
    <Observable<CustomHttpResponse<String>>>(
      this.http
        .patch<CustomHttpResponse<String>>(
          `${this.server}/${referenceCredit}/status`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Mise a jour du status pour le credit par l'agent de credit
   * @param referenceCredit
   * @returns
   */
  updateStatutCreditByAgent$ = (referenceCredit: string) =>
    <Observable<CustomHttpResponse<String>>>(
      this.http
        .patch<CustomHttpResponse<String>>(
          `${this.server}/${referenceCredit}/statusByAgent`,
          {}
        )
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   *  Get all Cantones by CodProvinces
   * @param codProvincia
   * @returns
   */
  allCantonsByProvince$ = (
    codProvincia: string
  ): Observable<CustomHttpResponse<CantonState>> =>
    this.http
      .get<CustomHttpResponse<CantonState>>(
        `${this.server}/allCantones/${codProvincia}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)), // Log API response
        catchError(this.handleError)
      );

  /**
   * Get All district
   * @param codCanton
   * @param codProvincia
   * @returns
   */
  allDistrictByCanton$ = (
    codCanton: string,
    codProvincia: string
  ): Observable<CustomHttpResponse<DistrictState>> =>
    this.http
      .get<CustomHttpResponse<DistrictState>>(
        `${this.server}/allDistrict/${codCanton}/${codProvincia}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   * Note profile
   * @param referenceCredit
   * @returns
   */
  newNoteProfile$ = (
    referenceCredit: string,
    newNoteCredit: string
  ): Observable<CustomHttpResponse<NoteProfileState>> =>
    this.http
      .get<CustomHttpResponse<NoteProfileState>>(
        `${this.server}/${referenceCredit}/newNoteCredit?statutNote=${newNoteCredit}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   *  Ajout note profile
   * @param noteprofileForm
   * @returns
   */
  addProfile$ = (noteprofileForm: NoteProfile) =>
    <Observable<CustomHttpResponse<NoteProfileState>>>this.http
      .post<CustomHttpResponse<NoteProfileState>>(
        `${this.server}/addNoteCredit`,
        noteprofileForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Note Analyse
   * @param referenceCredit
   * @returns
   */
  newNoteAnalyse$ = (
    referenceCredit: string,
    newNoteCredit: string
  ): Observable<CustomHttpResponse<NoteAnalyseState>> =>
    this.http
      .get<CustomHttpResponse<NoteAnalyseState>>(
        `${this.server}/${referenceCredit}/newNoteAnalyse?statutNote=${newNoteCredit}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   *  Ajout Note analyse
   * @param noteanalyseForm
   * @returns
   */
  addNoteAnalyse$ = (noteanalyseForm: NoteAnalyse) =>
    <Observable<CustomHttpResponse<NoteAnalyseState>>>this.http
      .post<CustomHttpResponse<NoteAnalyseState>>(
        `${this.server}/addNoteAnalyse`,
        noteanalyseForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Note Garantie
   * @param referenceCredit
   * @returns
   */
  newNoteGarantie$ = (
    referenceCredit: string,
    newNoteCredit: string
  ): Observable<CustomHttpResponse<NoteGarantieState>> =>
    this.http
      .get<CustomHttpResponse<NoteGarantieState>>(
        `${this.server}/${referenceCredit}/newNoteGarantie?statutNote=${newNoteCredit}`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   *  Ajout Note Garantie
   * @param notegarantieForm
   * @returns
   */
  addNoteGarantie$ = (notegarantieForm: NoteGarantie) =>
    <Observable<CustomHttpResponse<NoteGarantieState>>>this.http
      .post<CustomHttpResponse<NoteGarantieState>>(
        `${this.server}/addNoteGarantie`,
        notegarantieForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Appreciation DA
   * @param referenceCredit
   * @returns
   */
  newAppreciation$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<AppreciationState>> =>
    this.http
      .get<CustomHttpResponse<AppreciationState>>(
        `${this.server}/${referenceCredit}/newAppreciation`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   *  Ajout Nouvelle Appreciation
   * @param appreciationForm
   * @returns
   */
  addAppreciation$ = (appreciationForm: Appreciation) =>
    <Observable<CustomHttpResponse<AppreciationState>>>this.http
      .post<CustomHttpResponse<AppreciationState>>(
        `${this.server}/addAppreciation`,
        appreciationForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * ResultNote
   * @param referenceCredit
   * @returns
   */
  newResultNote$ = (
    referenceCredit: string
  ): Observable<CustomHttpResponse<ResultNoteState>> =>
    this.http
      .get<CustomHttpResponse<ResultNoteState>>(
        `${this.server}/${referenceCredit}/resultNote`
      )
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );

  /**
   *  Ajout ResultNote
   * @param resultnoteForm
   * @returns
   */
  addResultNote$ = (resultnoteForm: ResultNote) =>
    <Observable<CustomHttpResponse<ResultNoteState>>>this.http
      .post<CustomHttpResponse<ResultNoteState>>(
        `${this.server}/addResultNote`,
        resultnoteForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Information Credit
   * @param referenceCredit
   * @returns
   */
  creditView$ = (): Observable<CustomHttpResponse<CreditState>> =>
    this.http
      .get<CustomHttpResponse<CreditState>>(`${this.server}/creditView`)
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError(this.handleError)
      );
  /**
   * Adhesion Personne Physique
   * @param individuelForm
   * @returns
   */
  addPersonneP$ = (individuelForm: Individuel) =>
    <Observable<CustomHttpResponse<PersonnePState>>>this.http
      .post<CustomHttpResponse<PersonnePState>>(
        `${this.server}/add`,
        individuelForm,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(tap(console.log), catchError(this.handleError));

  /**
   * Error Handler fonctionnality
   * @param error
   * @returns
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      console.log(error.error);
      errorMessage = `A client error occured - ${error.error.message}`;
    } else {
      if (error.error.message) {
        errorMessage = error.error.message;
        console.log(error.error.reason);
      } else if (error.error) {
        const errorKeys = Object.keys(error.error);
        if (errorKeys.length > 0) {
          const key = errorKeys[0];
          errorMessage = error.error[key];
          console.log(`${key}: ${error.error[key]}`);
        } else {
          errorMessage = `An error occurred - Error status ${error.status}`;
        }
      } else {
        errorMessage = `An error Occurred - Error status ${error.status}`;
      }
    }
    return throwError(() => errorMessage);
  }
}
