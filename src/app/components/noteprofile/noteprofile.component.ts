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
  NoteProfileState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { User } from '../../interfaces/user';
@Component({
  selector: 'app-noteprofile',
  templateUrl: './noteprofile.component.html',
  styleUrl: './noteprofile.component.css',
})
export class NoteprofileComponent implements OnInit {
  @Input() user?: User;
  @Input() referenceCredit?: string;
  noteProfileState$: Observable<State<CustomHttpResponse<NoteProfileState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<NoteProfileState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  public readonly DataState = DataState;

  private disableSubject = new BehaviorSubject<boolean>(false); // is null
  public isDisabled$ = this.disableSubject.asObservable();

  noteProfileForm!: FormGroup;

  // Options pour les notes
  valeurs: number[] = [1, 2, 3, 4, 5];

  readonly stateNoteProfile: string = 'ENCOURS';

  constructor(
    private fb: FormBuilder,
    private individuelService: DemandeIndividuelService
  ) {}

  ngOnInit(): void {
    this.noteProfileForm = this.fb.group({
      referenceCredit: [''],
      user_id: [''],
      motif: ['', Validators.required],
      note: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      statusNote: [''],
    });
    // set the reference value as default
    this.noteProfileForm.patchValue({ referenceCredit: this.referenceCredit });
    // set the user_id value as default
    this.noteProfileForm.patchValue({ user_id: this.user?.id });
    this.noteProfileForm.patchValue({ statusNote: 'ENCOURS' });
    this.noteProfileState$ = this.individuelService
      .newNoteProfile$(this.referenceCredit!, this.stateNoteProfile)
      .pipe(
        map((response) => {
          console.log(response.data);
          this.dataSubject.next(response);
          this.disableSubject.next(
            response.data?.noteProfile?.referenceCredit == null
          );
          if (response.data != null) {
            this.noteProfileForm.patchValue({
              note: response.data.noteProfile?.note,
              motif: response.data.noteProfile?.motif,
            });
          }
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
    this.loadingSubject.next(true);
    this.noteProfileState$ = this.individuelService
      .addProfile$(this.noteProfileForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.disableSubject.next(response.data == null);
          this.loadingSubject.next(false);
          if (response.data != null) {
            this.noteProfileForm.patchValue({
              note: response.data.noteProfile?.note,
              motif: response.data.noteProfile?.motif,
              referenceCredit: response.data.noteProfile?.referenceCredit,
            });
          }
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
