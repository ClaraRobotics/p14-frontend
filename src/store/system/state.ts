import { atom } from 'recoil';
import { cloneDeep } from 'lodash';
import { State } from './types';

const defaultSystem: State = {
  //TO-DO: confirm default value
  boxMargin: 5,
  overHang: 100,
  boxMaxWidth: 1300,
  boxMaxHeight: 1300,
  boxMinWidth: 300,
  boxMinHeight: 300,
  // stackHeight: 2400,
  // stackHeightCondition: []
};

const systemState = atom({
  key: 'system',
  default: cloneDeep(defaultSystem),
})

export default systemState;
