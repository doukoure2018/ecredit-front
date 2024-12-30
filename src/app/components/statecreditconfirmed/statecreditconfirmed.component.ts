import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  finalize,
  map,
  Observable,
  of,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse } from '../../interfaces/appstates';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statecreditconfirmed',
  templateUrl: './statecreditconfirmed.component.html',
  styleUrl: './statecreditconfirmed.component.css',
})
export class StatecreditconfirmedComponent implements OnInit {
  @Input() referenceCredit?: string;
  confirmedStateAgent$: Observable<State<CustomHttpResponse<string>>> =
    new Observable();
  private dataSubject = new BehaviorSubject<CustomHttpResponse<string> | null>(
    null
  );
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  constructor(
    private confirmedService: DemandeIndividuelService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  confirmedCreditAgent(): void {
    if (!this.referenceCredit) {
      console.error('Reference credit is undefined or null.');
      return;
    }

    this.loadingSubject.next(true);

    this.confirmedService
      .updateStatutCreditByAgent$(this.referenceCredit)
      .pipe(
        map((response) => {
          console.log('Credit status updated successfully:', response);
          this.router.navigate([`/home`]);
        }),
        catchError((error) => {
          console.error('Error updating credit status:', error);
          return of(null);
        }),
        finalize(() => {
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }
}
