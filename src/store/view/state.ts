import { atom } from 'recoil';
import { cloneDeep } from 'lodash';
import { State } from './types';

export const defaultView: State = {
  showControlCenter: false,
  showReleaseEmerModal: false,
  showPalletNotEmptyModal: false,
  showIntrusionDetectedModal: false,
  showLowSlipSheetModal:false,
  showLowPalletModal:false,
  showToast:false,
  showRefillLightCurtainConfirmModal: false,
  showAlarmModal:false
};

const viewState = atom({
  key: 'view',
  default: cloneDeep(defaultView),
})

export default viewState;
