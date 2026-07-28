import { ValueModel } from '@kts-specials/mediaproject-stores';

import { SnackbarMessageType } from 'config/snackbars';

export interface ISnackbarStore {
  snackbarMessage: ValueModel<SnackbarMessageType | null>;

  isSnackbarOpen: boolean;

  openSnackbarMessage: (message?: SnackbarMessageType) => void;

  triggerDefaultErrorMessage: () => void;

  closeSnackbar: () => void;
}
