import { authenSelectors } from '@/store/authen';
import { useState, useCallback } from 'react';
import { useRecoilValue } from 'recoil';

export type str = string;
export type ApiMethod = 'GET' | 'POST';
export type ApiState = 'idle' | 'loading' | 'done' | 'error';

const  baseURL = process.env.ROBOT_ENV === 'production'
      ? 'http://localhost:8082'
      : 'http://localhost:8082';

const fetcher = async (
  url: str,
  method: ApiMethod,
  payload?: str,
  isFormdata?: boolean
): Promise<any> => {
  const requestHeaders = new Headers();
  if (!isFormdata) {
    requestHeaders.set('Content-Type', 'application/json');
  }
  // requestHeaders.set('Authorization', 'Bearer ' + jwtToken);
  // console.log({url});

  const res = await fetch(baseURL + url, {
    body: payload
      ? isFormdata === false
        ? JSON.stringify(payload)
        : payload
      : undefined,
    headers: requestHeaders,
    method,
  });

  const resobj = await res.json();
  return resobj;
};

export function useApi(
  url: str,
  method: ApiMethod
): {
  apiState: ApiState;
  data: any;
  isError: boolean;
  error: Error;
  execute: (payload?: any, isFormdata?: boolean) => void;
} {
  const [apiState, setApiState] = useState<ApiState>('idle');
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error>(null);
  const [data, setData] = useState<unknown>(null);
  const [toCallApi, setApiExecution] = useState(false);

  const execute = (payload, isFormdata = false) => {
    setApiExecution(true);
    setApiState('loading');
    // console.log('executing now');
    // console.log('isformdata', isFormdata);
    fetchApi(payload, isFormdata);
  };

  const fetchApi = useCallback(
    (payload, isFormdata) => {
      // console.log('fetchApi called', payload);
      fetcher(url, method, payload, isFormdata)
        .then((res) => {
          const data = res;
          // console.log('return from fetchapi:', data);
          setData({ ...data });
          setApiState('done');
          return;
        })
        .catch((e: Error) => {
          setData(null);
          setIsError(true);
          setError(e);
          setApiState('error');
        });
      // .finally(() => {

      // });
    },
    [method, url]
  );

  return {
    apiState,
    data,
    isError,
    error,
    execute,
  };
}
