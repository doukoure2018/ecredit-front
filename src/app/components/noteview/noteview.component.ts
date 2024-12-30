import { Component, Input, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import {
  CustomHttpResponse,
  NoteviewCreditState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-noteview',
  templateUrl: './noteview.component.html',
  styleUrl: './noteview.component.css',
})
export class NoteviewComponent implements OnInit {
  @Input() referenceCredit?: string;
  noteViewCreditState$: Observable<
    State<CustomHttpResponse<NoteviewCreditState>>
  > = new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<NoteviewCreditState> | null>(null);

  public readonly DataState = DataState;

  constructor(private noteService: DemandeIndividuelService) {}
  ngOnInit(): void {
    this.noteViewCreditState$ = this.noteService
      .noteviewCredit$(this.referenceCredit!)
      .pipe(
        map((response) => {
          console.log(response);
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
}
