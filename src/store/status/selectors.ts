import { selector } from 'recoil';
import { StatusState } from '.';
import { isEmpty } from 'lodash';
import statusState from './state';



export const isThereCurrentTaskA = selector({
  key: 'isThereCurrentTaskA',
  get: ({ get }) => {
    const status = get(statusState);
    return !isEmpty(status.currentTask[0]);//true when there is a task, false otherwise
  },
});

export const isThereCurrentTaskB = selector({
  key: 'isThereCurrentTaskB',
  get: ({ get }) => {
    const status = get(statusState);
    return !isEmpty(status.currentTask[1]);//true when there is a task, false otherwise
  },
});