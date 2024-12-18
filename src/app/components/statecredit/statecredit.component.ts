import { Component, Input, OnInit } from '@angular/core';
import { GarantieState } from '../../interfaces/appstates';
import { ActivatedRoute, Router } from '@angular/router';
import { DemandeIndividuelService } from '../../services/individuel.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  of,
  startWith,
} from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-statecredit',
  templateUrl: './statecredit.component.html',
  styleUrl: './statecredit.component.css',
})
export class StatecreditComponent implements OnInit {
  @Input() garantieMatState?: GarantieState;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  constructor(
    private router: Router,
    private stateService: DemandeIndividuelService
  ) {}
  ngOnInit(): void {}

  goBack() {
    this.router.navigate([
      `/frequence/${this.garantieMatState?.garantieMat?.referenceCredit}`,
    ]);
  }

  confirmedCredit(): void {
    if (!this.garantieMatState?.garantieMat?.referenceCredit) {
      console.error('Reference credit is undefined or null.');
      return;
    }

    this.loadingSubject.next(true); // Set loading state to true

    this.stateService
      .updateStatutCredit$(this.garantieMatState.garantieMat.referenceCredit)
      .pipe(
        map((response) => {
          console.log('Credit status updated successfully:', response);
          this.router.navigate([`/home`]);
        }),
        catchError((error) => {
          console.error('Error updating credit status:', error);
          return of(null); // Handle error and return a fallback observable
        }),
        finalize(() => {
          this.loadingSubject.next(false); // Set loading state to false after operation
        })
      )
      .subscribe();
  }
}
