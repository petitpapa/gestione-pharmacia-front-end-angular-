import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  CommandContainer,
  CommandResponse,
  CommandState,
  MessageType,
} from "../../core/models";
import { CommandsService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import { DetailDialogComponent } from "./detail-dialog/detail-dialog.component";

@Component({
  selector: "app-validate-commandes",
  templateUrl: "./validate-commandes.component.html",
  styleUrls: ["./validate-commandes.component.scss"],
})
export class ValidateCommandesComponent implements OnInit, OnDestroy {
  commands: CommandContainer[];
  CommandsSubcription: Subscription[] = [];

  constructor(
    private commandService: CommandsService,
    public dialog: MatDialog,
    private store: Store<CoreState>
  ) {}

  ngOnInit(): void {
    const sub = this.commandService
      .loadNewCommandsByStatus(CommandState.DELIVERED)
      .subscribe((res) => {
        this.commands = res.containers;
      });
    this.CommandsSubcription.push(sub);
  }

  openDetailDialog(id: number): void {
    const sub = this.commandService
      .loadCommandById(id)
      .subscribe((res: CommandResponse) => {
        const dialogRef = this.dialog.open(DetailDialogComponent, {
          width: "1000px",
          data: { command: res.containers[0] },
        });
        this.CommandsSubcription.push(sub);
        dialogRef.afterClosed().subscribe((result) => {
          console.log(`Dialog result: ${result}`);
        });
      });
  }

  validatedCommand(id: number): void {
    this.commandService.validateCommand({ commandId: id }).subscribe((res) => {
      if (res.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c est produite: " + res.errorMessage,
          })
        );
      } else {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.SUCCESS,
            msg: "La commande a été validée avec succes"
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.CommandsSubcription.forEach((element) => {
      if (element) {
        element.unsubscribe();
      }
    });
  }
}
