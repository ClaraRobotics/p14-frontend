import { SetterOrUpdater } from 'recoil'
import { cloneDeep } from 'lodash';

import { defaultView } from './state'
import { State } from './types'
import { StatusState } from '..';

export const initialize = (setter: SetterOrUpdater<State>) => {
  setter(cloneDeep(defaultView));
};

export const toggleControlCenter = (state: State, setter: SetterOrUpdater<State>, payload?: boolean) => {
  const show = payload === undefined? !state.showControlCenter : payload;

  setter({...state, showControlCenter: show});
};

export const setReleaseEmerModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {

  setter({ ...state, showReleaseEmerModal: payload });
};

export const setPalletNotEmptyModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showPalletNotEmptyModal: payload });
};


export const checkEmerThencall = (
  state: State,
  setter: SetterOrUpdater<State>,
  statusState: StatusState,
  callback: () => any
) => {
  const isEmergencyTriggered = statusState.lastHeartBeatMessage.emergency?.all === false
  if (isEmergencyTriggered === true) {
    setter({ ...state, showReleaseEmerModal: true });
    return;
  } else {
    callback();
  }
};

export const checkEmptyPalletThenCall = (
  state: State,
  setter: SetterOrUpdater<State>,
  statusState: StatusState,
  callback: () => any
) => {
  const isPalletEjected =
    statusState.lastHeartBeatMessage?.pallet_ejected;
  if (isPalletEjected !== true) { // IF NOT EMPTY
    setter({ ...state, showPalletNotEmptyModal: true });
    return;
  } else {
    callback();
  }
};

export const setIntrustionDetectedModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showIntrusionDetectedModal: payload });
};


export const setLowPalletModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showLowPalletModal: payload });
};
export const setLowSlipsheetModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showLowSlipSheetModal: payload });
};
export const setRefillLightcurtainconfirmModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showRefillLightCurtainConfirmModal: payload });
};
export const setAlarmModal = (
  state: State,
  setter: SetterOrUpdater<State>,
  payload: boolean
) => {
  setter({ ...state, showAlarmModal: payload });
};
