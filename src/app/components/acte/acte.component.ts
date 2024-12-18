import { Component, Input, OnInit } from '@angular/core';

import { ActeInd } from '../../interfaces/acte-ind';
import { DemandeIndividuelService } from '../../services/individuel.service';
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
  ActeState,
  CustomHttpResponse,
  GarantieState,
} from '../../interfaces/appstates';
import { DataState } from '../../enum/datastate.enum';

@Component({
  selector: 'app-acte',
  templateUrl: './acte.component.html',
  styleUrl: './acte.component.css',
})
export class ActeComponent implements OnInit {
  fileUploadState$: Observable<State<CustomHttpResponse<ActeState>>> =
    new Observable();
  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<ActeState> | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  readonly DataState = DataState;

  // @Input() actes?: ActeInd[];
  @Input() referenceCredit?: string;
  selectedFiles: File[] = [];

  constructor(private fileUploadService: DemandeIndividuelService) {}
  ngOnInit(): void {
    this.fileUploadState$ = this.fileUploadService
      .newActe$(this.referenceCredit!)
      .pipe(
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
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  isImage(fileUrl: string): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const fileExtension = fileUrl.split('.').pop()?.toLowerCase();
    return imageExtensions.includes(fileExtension || '');
  }

  isPDF(fileUrl: string): boolean {
    return fileUrl.toLowerCase().endsWith('.pdf');
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  uploadFiles(): void {
    this.loadingSubject.next(true);
    const formData = new FormData();
    this.selectedFiles.forEach((file) => formData.append('files', file));

    this.fileUploadState$ = this.fileUploadService
      .addActe$(this.referenceCredit!, formData)
      .pipe(
        map((response) => {
          console.log(response);
          this.dataSubject.next(response);
          this.loadingSubject.next(false);
          return {
            dataState: DataState.LOADED,
            appData: this.dataSubject.value ?? undefined,
          };
        }),
        startWith({
          dataState: DataState.LOADING,
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          this.loadingSubject.next(false);
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }

  deleteActe(id: number): void {
    const formData = new FormData();
    this.selectedFiles.forEach((file) => formData.append('files', file));

    this.fileUploadState$ = this.fileUploadService
      .deleteActe$(id, this.referenceCredit!)
      .pipe(
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
          appData: this.dataSubject.value ?? undefined,
        }),
        catchError((error: string) => {
          return of({
            dataState: DataState.ERROR,
            error,
            appData: this.dataSubject.value ?? undefined,
          });
        })
      );
  }
}
