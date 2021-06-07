import { createAction, props } from "@ngrx/store";
import { MessageType } from "../models/message.type";

export const sidebarToggle = createAction(
  "[Sidebar Collapse] toggle sidebar",
  props<{ sidebarExpanded: boolean }>()
);

export const onNotificationMessage = createAction(
  "[App component] notification",
  props<{ msgType: MessageType; msg: string }>()
);

export const onNextPage = createAction(
  "[PaginationContainer] click on next page",
  props<{ currentIndex: number; isFirst: boolean; isLast: boolean }>()
);

export const onFirstAndLastPageState = createAction(
  "[PaginationContainer] first and last page state",
  props<{ isFirst: boolean; isLast: boolean }>()
);
