import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  pipe,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { CustomHttpResponse, PersonnePState } from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';
import { DemandeIndividuelService } from '../../services/individuel.service';
import { NgForm } from '@angular/forms';
import { Cantones, District } from '../../interfaces/individuel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personnephysique',
  templateUrl: './personnephysique.component.html',
  styleUrl: './personnephysique.component.css',
})
export class PersonnephysiqueComponent implements OnInit {
  personnepState$: Observable<State<CustomHttpResponse<PersonnePState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<PersonnePState> | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;

  cantons: Cantones[] = [];
  districts: District[] = [];

  selectedProvince: string | null = null;
  selectedCanton: string | null = null;

  expirationDate!: string;
  dateNaissance!: string;
  constructor(
    private individuelService: DemandeIndividuelService,
    private router: Router
  ) {}

  formatExpirationDate(date: Date): void {
    const formattedDate = new Date(date).toISOString();
    this.expirationDate = formattedDate; // e.g., "2025-01-01T00:00:02"
  }
  formatDateNaissance(date: Date): void {
    const formattedDate = new Date(date).toISOString();
    this.dateNaissance = formattedDate; // e.g., "2025-01-01T00:00:02"
  }
  ngOnInit(): void {
    this.personnepState$ = this.individuelService.personnep$().pipe(
      map((response) => {
        console.log(response);
        this.dataSubject.next(response);
        return {
          dataState: DataState.LOADED,
          appData: this.dataSubject.value ?? undefined,
        };
      }),
      startWith({
        dataState: DataState.LOADING,
      }),
      catchError((error: string) => {
        return of({
          dataState: DataState.ERROR,
          error,
        });
      })
    );
  }

  onProvinceChange(provinceId: string): void {
    console.log(provinceId);
    this.selectedProvince = provinceId;

    this.individuelService.allCantonsByProvince$(provinceId).subscribe({
      next: (response) => {
        this.cantons = response?.data?.canton || [];
        this.districts = []; // Reset districts when province changes
      },
      error: (error) => {
        console.error('Error fetching cantons:', error);
      },
      complete: () => {
        console.log('Fetch cantons completed');
      },
    });
  }

  onCantonChange(cantonId: string): void {
    // const target = event.target as HTMLSelectElement;
    // const cantonId = target.value;

    if (this.selectedProvince && cantonId) {
      this.selectedCanton = cantonId;

      this.individuelService
        .allDistrictByCanton$(cantonId, this.selectedProvince)
        .subscribe({
          next: (response) => {
            this.districts = response?.data?.district || [];
          },
          error: (error) => {
            console.error('Error fetching districts:', error);
          },
          complete: () => {
            console.log('Fetch districts completed');
          },
        });
    }
  }

  /**
   * Add Personne Physique
   * @param individuelForm
   */
  public addPersonneP(individuelForm: NgForm): void {
    this.loadingSubject.next(true);
    console.log(individuelForm.value);
    this.personnepState$ = this.individuelService
      .addPersonneP$(individuelForm.value)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: response,
          };
        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          this.loadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error });
        })
      );
  }
}
