import { atom } from 'recoil';
import { cloneDeep } from 'lodash';
import { State } from './types';

export const defaultStatus: State = {
  connectionStatus: 'closed',
  lastHeartBeatMessage: {},
  currentTask:[{},[]],
  writeJobLoading:false,
  taskTitle: 'untitled'
};

const statusState = atom({
  key: 'status',
  default: cloneDeep(defaultStatus),
})

export default statusState;
