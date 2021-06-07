import { createAction, props } from '@ngrx/store';

export const sidebarStart = createAction(
    '[sidebar] sidebar is loading',
);

export const sidebarLoadSuccess = createAction(
    '[sidebar] sidebar load Success',
    props<{results: any}>()
);

export const sidebarLoadFailure = createAction(
    '[sidebar] sidebar load Failure',
    props<{error: string}>()
);
