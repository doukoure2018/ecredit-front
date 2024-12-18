export class Individuel {
  id?: number;
  createdAt?: Date;
  catMembre?: string;
  numeroMembre?: string;
  nom?: string;
  prenom?: string;
  dateNaissance?: Date;
  lieuxNaissance?: string;
  nationalite?: string;
  telephone?: string;
  telephone2?: string;
  typePiece?: string;
  numeroPiece?: string;
  sexe?: string;
  profession?: string;
  nomPere?: string;
  nomMere?: string;
  activite?: string;
  nbreEnfant?: number;
  nbreParent?: number;
  nbreAutre?: number;
  quartier?: string;
  district?: string;
  secteur?: string;
  cotisation?: number;
  droitEntree?: number;
  typeHabitation?: string;
  nbreAnnee?: number;
  statutIndividuel?: string;
  prestataire?: string;
  referenceCredit?: string;
  codCanton?: string;
  ville?: string;
  typeEntreprise?: string;
  lienParente?: string;
  nomParent?: string;
  conjoint?: string;
  expirationDate?: Date;
  nbreAnneeH?: number;
  adresse?: string;
  user_id?: number;
}

// Primary key structures
export interface TypeIdPKId {
  cod_EMPRESA?: string;
  cod_TIPO_ID?: string;
}

export interface PrestatairePKId {
  cod_EMPRESA?: string;
  cod_PROVEEDOR?: string;
}

export interface CategorieClientPKId {
  cat_CLIENTE?: string;
  cod_EMPRESA?: string;
}

export interface SectorEconomicoPKId {
  cod_SECTOR?: string;
  cod_EMPRESA?: string;
}

export interface ProvinciasPKId {
  cod_PROVINCIA?: string;
  cod_PAIS?: string;
}

export interface ProfessionPKId {
  cod_PROFESION?: string;
  cod_EMPRESA?: string;
}

// Main structures
export interface TypeId {
  typeIdPKId?: TypeIdPKId;
  mascara?: string;
  des_TIPO_ID?: string;
  ind_LARGO_FIJO?: string;
}

export interface Prestataire {
  prestatairePKId?: PrestatairePKId;
  des_PROVEEDOR?: string;
}

export interface CategorieClient {
  categorieClientePKId?: CategorieClientPKId;
  des_CATEGORIA?: string;
}

export interface Secteur {
  sectorEconomicoPKId?: SectorEconomicoPKId;
  des_SECTOR?: string;
}

export interface Provincia {
  provinciasPKId?: ProvinciasPKId;
  des_PROVINCIA?: string;
}

export interface Activite {
  id?: string;
  des_ACTIVIDAD?: string;
}

export interface Profession {
  professionPKId?: ProfessionPKId;
  des_PROFESION?: string;
}

export interface CantonesPKId {
  codCanton?: string;
  codPais?: string;
  codProvincia?: string;
}

export interface Cantones {
  cantonesPKId?: CantonesPKId;
  des_CANTON?: string;
}

export interface District {
  codDistrito?: string;
  COD_PAIS?: string;
  codProvincia?: string;
  codCanton?: string;
  des_DISTRITO?: string;
}

// Combined structure for the entire object
export interface CompleteStructure {
  typeId?: TypeId[];
  prestataire?: Prestataire[];
  categorieClient?: CategorieClient[];
  secteur?: Secteur[];
  provincia?: Provincia[];
  activite?: Activite[];
  profession?: Profession[];
}
