import { atom } from 'recoil';
import { cloneDeep } from 'lodash';
import { State } from './types';

export const defaultStatus: State = {
  connectionStatus: 'closed',
  lastHeartBeatMessage: {},
  currentTask:[null, null],
  writeJobLoading:false,
  taskTitle: ['untitled','untitled']
};

const statusState = atom({
  key: 'status',
  default: cloneDeep(defaultStatus),
})

export default statusState;
