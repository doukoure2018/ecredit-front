export interface DemandeIndividuel {
  id?: number; // Optional, since it may not be set for new records
  nom?: string;
  prenom?: string;
  telephone?: string;
  age?: number;
  numeroMembre?: string;
  delegation?: number;
  agence?: number;
  pos?: number;
  quartier?: string;
  fonction?: string;
  createdAt?: string; // Use ISO string for dates in TypeScript
  montant?: number; // BigDecimal maps to number in TypeScript
  activite?: string;
  statutDemande?: string; // Possible values?: "new", "accepted", "selected", "rejected", "approved"
  communeResidence?: string;
  validationState?: string;
  typeApport?: string;
  statutSelection?: string;
  currentActivite?: string;
  raison?: string;
  object?: string;
  tipCredito?: number;
  codUsuarios?: string;
}
