import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as fromSidebarActions from "./sidebar.actions";
import { catchError, map, switchMap, withLatestFrom } from "rxjs/operators";
import { select, Store } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { sidebarRowData } from "./sidebar.selectors";
import { CoreState } from "../../store/core.reducer";
import { SidebarRowContainer } from "../../models/sidebar.row";

@Injectable({providedIn:"root"})
export class SidebarEffects {
  constructor(
    private actions$: Actions,
    private store: Store<CoreState>,
    private http: HttpClient
  ) {}

  loadSidebarRowData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromSidebarActions.sidebarStart),
      withLatestFrom(this.store.pipe(select(sidebarRowData))),
      map(([_, sidebarRows]) => sidebarRows),
      switchMap((sidebarRow) => {
        if (sidebarRow.length === 0) {
          return this.http
            .get<SidebarRowContainer>("/rs/sidebar-row/load-data")
            .pipe(
              catchError((err) => {
                console.log("error loading sidebar page", err);
                this.store.dispatch(
                  fromSidebarActions.sidebarLoadFailure({
                    error: "error loading",
                  })
                );
                return of([]);
              })
            );
        } else {
          return of([]);
        }
      }),
      map((results) => fromSidebarActions.sidebarLoadSuccess({ results }))
    )
  );
}
