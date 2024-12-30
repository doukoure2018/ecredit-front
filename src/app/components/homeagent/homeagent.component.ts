import { Component, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import { State } from '../../interfaces/state';
import { DataState } from '../../enum/datastate.enum';
import { RoleState } from '../../enum/rolestate.enum';
import { CustomHttpResponse, HomeState } from '../../interfaces/appstates';
import { DemandeIndividuelService } from '../../services/individuel.service';

@Component({
  selector: 'app-homeagent',
  templateUrl: './homeagent.component.html',
  styleUrl: './homeagent.component.css',
})
export class HomeagentComponent implements OnInit {
  homeAgentState$: Observable<State<CustomHttpResponse<HomeState>>> =
    new Observable();

  private dataSubject =
    new BehaviorSubject<CustomHttpResponse<HomeState> | null>(null);

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoadingSubject = this.loadingSubject.asObservable();
  public readonly DataState = DataState;

  constructor(private demandeIndividuelService: DemandeIndividuelService) {}

  ngOnInit(): void {
    this.homeAgentState$ = this.demandeIndividuelService.home$().pipe(
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
        return of({ dataState: DataState.ERROR, error });
      })
    );
  }
}
