import { Component, Input, OnInit } from '@angular/core';
import { DataState } from '../../enum/datastate.enum';
import { User } from '../../interfaces/user';
import {
  CustomHttpResponse,
  ResultNoteState,
} from '../../interfaces/appstates';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  Observable,
  BehaviorSubject,
  map,
  startWith,
  catchError,
  of,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resultnote',
  templateUrl: './resultnote.component.html',
  styleUrl: './resultnote.component.css',
})
export class ResultnoteComponent implements OnInit {
  @Input() referenceCredit?: string;
  @Input() user?: User;
  resultNoteState$: Observable<State<CustomHttpResponse<ResultNoteState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<ResultNoteState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  resultNoteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resultNoteForm = this.fb.group({
      referenceCredit: [''],
      user_id: [''],
    });
    // set the reference value as default
    this.resultNoteForm.patchValue({
      referenceCredit: this.referenceCredit,
      user_id: this.user?.id,
    });

    this.resultNoteState$ = this.individuelService
      .newResultNote$(this.referenceCredit!)
      .pipe(
        map((response) => {
          this.dataSubject.next(response);

          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  public onSave(): void {
    console.log(this.resultNoteForm.value);
    this.loadingSubject.next(true);
    this.resultNoteState$ = this.individuelService
      .addResultNote$(this.resultNoteForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingSubject.next(false);
          this.router.navigate([`/home`]);
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.loadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
          });
        })
      );
  }

  public updateData(): void {
    console.log('this is update information');
  }
}
