import { createReducer, on } from "@ngrx/store";
import { MessageType } from '../models/message.type';
import * as fronCoreActions from "./core.actions";

export interface CoreState {
  sidebarExpanded: boolean;
  notification: {
    msgType: MessageType;
    notificationMessage: string;
  };
  pagination: {
    isFirst: boolean;
    isLast: boolean;
    currentIndex: number;
  };
}

const initialState: CoreState = {
  sidebarExpanded: false,
  notification: {
    msgType: MessageType.INFO,
    notificationMessage: "",
  },
  pagination: {
    isFirst: true,
    isLast: false,
    currentIndex: 0,
  },
};

export const reducer_core = createReducer(
  initialState,
  on(fronCoreActions.sidebarToggle, (state) => ({
    ...state,
    sidebarExpanded: !state.sidebarExpanded,
  })),

  on(fronCoreActions.onNotificationMessage, (state, action) => ({
    ...state,
    notification: { notificationMessage: action.msg, msgType: action.msgType },
  })),
  on(fronCoreActions.onNextPage, (state, action) => ({
    ...state,
    pagination: {
      currentIndex: action.currentIndex,
      isFirst: false,
      isLast: false,
    },
  }))
);
