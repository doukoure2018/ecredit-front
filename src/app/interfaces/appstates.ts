import { DataState } from '../enum/datastate.enum';
import { ActeInd } from './acte-ind';
import { Agence } from './agence';
import { Appreciation } from './appreciation';
import { ChargesInd } from './charge-ind';
import { ConfirmedCreditInd } from './confirmed-credit-ind';
import { Credit } from './credit';
import { DemandeIndividuel } from './demande-individuel';
import { Events } from './event';
import { Frequence } from './frequence';
import { GarantieMatInd } from './garantiemat-ind';
import {
  Activite,
  Cantones,
  CategorieClient,
  District,
  Individuel,
  Prestataire,
  Profession,
  Provincia,
  Secteur,
  TypeId,
} from './individuel';
import { Localisation } from './localisation';
import { NoteAnalyse } from './note-analyse';
import { NoteGarantie } from './note-garantie';
import { NoteProfile } from './note-profile';
import { Personnecaution } from './personne-caution';
import { PetitCredit } from './petit-credit';
import { Pointvente } from './pointvente';
import { ProduitInd } from './produit-ind';
import { ResultNote } from './result-note';
import { Role } from './role';
import { StateDemandeIndividuel } from './state-demande-individuel';
import { User } from './user';

export interface LoginState {
  dataState?: DataState;
  loginSuccess?: boolean;
  error?: string;
  message?: string;
  isUsingMfa?: boolean;
  phone?: string;
}

export interface CustomHttpResponse<T> {
  timeStamp?: Date;
  statusCode?: number;
  status?: string;
  message?: string;
  reason?: string;
  developerMessage?: string;
  data?: T;
}

export interface Profile {
  user?: User;
  roles?: Role[];
  events?: Events[];
  access_token?: string;
  refresh_token?: string;
}

export interface HomeState {
  user?: User;
  stateDemandeIndividuel?: StateDemandeIndividuel;
  credit?: Credit[];
  agence?: Agence;
  pointevente?: Pointvente;
}

export interface PersonnePState {
  user?: User;
  typeId?: TypeId[];
  prestataire?: Prestataire[];
  categorieClient?: CategorieClient[];
  secteur?: Secteur[];
  provincia?: Provincia[];
  activite?: Activite[];
  profession?: Profession[];
  canton?: Cantones[];
  district?: District[];
}

export interface CantonState {
  canton?: Cantones[];
}

export interface DistrictState {
  district?: District[];
}

export interface DemandeState {
  user?: User;
  demandes?: DemandeIndividuel[];
  demande?: DemandeIndividuel;
  credit?: Credit;
  individuel?: Individuel;
}

export interface ConfirmedCreditIndState {
  user?: User;
  confirmedCredit?: ConfirmedCreditInd;
}

export interface PetitCreditState {
  user?: User;
  petitcredit?: PetitCredit;
  credit?: Credit;
}

export interface ChargeIndState {
  user?: User;
  chargeind?: ChargesInd[];
  credit?: Credit;
}

export interface ProduitIndState {
  user?: User;
  produitInd?: ProduitInd[];
  credit?: Credit;
}

export interface FrequenceState {
  user?: User;
  frequence?: Frequence;
}

export interface GarantieState {
  user?: User;
  garantieMat?: GarantieMatInd;
  statecredit?: boolean;
  credit?: Credit;
}

export interface ActeState {
  user?: User;
  actes?: ActeInd[];
}

export interface PersonneCautionState {
  user?: User;
  garantiepersonnecaution?: Personnecaution[];
}

export interface LocalisationState {
  user?: User;
  localisation?: Localisation;
}

// Information detaillee de tous les credits
export interface DetailCreditIndState {
  user?: User;
  individuel?: Individuel;
  petitcredit?: PetitCredit;
  confirmedCredit?: ConfirmedCreditInd;
  chargeind?: ChargesInd[];
  produitInd?: ProduitInd[];
  garantieMat?: GarantieMatInd;
  garantiepersonnecaution?: Personnecaution[];
  localisation?: Localisation;
  actes?: ActeInd[];
  resultNote?: string;
  appreciation?: Appreciation;
}

export interface NoteviewCreditState {
  user?: User;
  noteProfile?: NoteProfile;
  noteAnalyse?: NoteAnalyse;
  noteGarantie?: NoteGarantie;
  appreciation?: Appreciation;
}

export interface NoteProfileState {
  noteProfile?: NoteProfile;
}

export interface NoteAnalyseState {
  noteAnalyse?: NoteAnalyse;
}

export interface NoteGarantieState {
  noteGarantie?: NoteGarantie;
}

export interface AppreciationState {
  user?: User;
  appreciation?: Appreciation;
}

export interface ResultNoteState {
  user?: User;
  resultnote?: ResultNote;
}

export interface CreditState {
  credit?: Credit[];
}
