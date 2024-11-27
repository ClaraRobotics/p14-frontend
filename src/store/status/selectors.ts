import { selector } from 'recoil';
import { StatusState } from '.';
import { isEmpty } from 'lodash';
import statusState from './state';



export const isThereCurrentTaskA = selector({
  key: 'isThereCurrentTaskA',
  get: ({ get }) => {
    const status = get(statusState);
    return status.currentTask[0] !== null;//true when there is a task, false otherwise
  },
});

export const isThereCurrentTaskB = selector({
  key: 'isThereCurrentTaskB',
  get: ({ get }) => {
    const status = get(statusState);
    return status.currentTask[1] !== null;//true when there is a task, false otherwise
  },
});