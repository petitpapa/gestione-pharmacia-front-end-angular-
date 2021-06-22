import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommandsService } from "../../core/services";
import { CommandResponse } from "../../core/models/command.response";
import { Observable, Subscription } from "rxjs";
import { catchError, map, reduce } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { DetailComponent } from "./detail/detail.component";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core/store/core.reducer";
import { onCommandSelected } from "../store/command.action";
import { CommandState, MessageType } from "../../core/models";
import { onNotificationMessage } from "../../core/store/core.actions";
class Summary {
  constructor(
    private cmdNumber: number,
    private supplierId: string,
    private supplier: string,
    private qty: number,
    private createdOn: Date
  ) {}
}
@Component({
  selector: "app-gestion-commande",
  templateUrl: "./gestion-commande.component.html",
  styleUrls: ["./gestion-commande.component.scss"],
})
export class GestionCommandeComponent implements OnInit, OnDestroy {
  commands: CommandResponse;

  commandSummaries: Summary[];

  subscribers: Subscription[] = [];

  displayedColumns: string[] = [
    "position",
    "Supplier",
    "Date",
    "Quantité(s)",
    "action",
  ];

  constructor(
    private commandSrv: CommandsService,
    public dialog: MatDialog,
    private router: Router,
    private store: Store<CoreState>
  ) {}

  ngOnInit(): void {
    this.loadNewCommands();
  }

  loadNewCommands(): void {
    const commandSub = this.commandSrv
      .loadNewCommandsByStatus(CommandState.NEW)
      .subscribe((res) => {
        if (res.errorMessage) {
          this.store.dispatch(
            onNotificationMessage({
              msgType: MessageType.ERROR,
              msg: "Une erreur c est produite: " + res.errorMessage,
            })
          );
        } else {
          this.commands = res;
          this.commandSummaries = this.commands.containers.map(
            (c) =>
              new Summary(
                c.commandId,
                c.supplierId,
                c.supplierName,
                c.items.length,
                c.createdOn
              )
          );
        }
      });
    this.subscribers.push(commandSub);
  }

  updateOrDetailCommand(id: number, update: boolean): void {
    const dialogRef = this.dialog.open(DetailComponent, {
      width: "70%",
      data: {
        cmd: this.commands.containers.find((c) => c.commandId === id),
        update: update,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log("result  ==> ", data);
    });
  }

  gotToRecptionPage(id: number): void {
    const cmd = this.commands.containers.find((c) => c.commandId === id);
    console.log(cmd);
    this.store.dispatch(onCommandSelected({ command: cmd }));
    this.router.navigateByUrl("/commandes/command-reception");
  }

  ngOnDestroy(): void {
    for (const sub of this.subscribers) {
      sub.unsubscribe();
    }
  }
}
