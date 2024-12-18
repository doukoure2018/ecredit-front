export interface Credit {
  user_id?: number;
  referenceCredit?: string;
  individuel_id?: number;
  status?: string;
  createAt: Date;
  typeCredit?: string;
  codeMembre?: string;
  delegationId?: number;
  agenceId?: number;
  pointVenteId?: number;
}
