import { selector } from 'recoil';
import { StatusState } from '.';
import { isEmpty } from 'lodash';
import statusState from './state';



export const isThereCurrentTask = selector({
  key: 'isThereCurrentTask',
  get: ({ get }) => {
    const status = get(statusState);
    return !isEmpty(status.currentTask);//true when there is a task, false otherwise
  },
});
