import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useLocation } from 'react-router-dom';

import PatternBuilder from '@/components/taskBuilder/PatternBuilder';
import LayerBuilder from '@/components/taskBuilder/LayerBuilder';
import Summary from '@/components/taskBuilder/Summary';
import Loading from '@/components/common/Loading';
import ErrorMsg from '@/components/common/ErrorMsg';

import { systemState, taskState, taskActions } from '@/store';
import api from '@/api';

const TaskBuilderView = () => {
  const location = useLocation();
  const setSystem = useSetRecoilState(systemState);
  const [ task, setTask ] = useRecoilState(taskState);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const { currentStep } = task;

  useEffect(() => {
    api.get('/load/system-env').then((res) => {
      setSystem({ ...res.data })
      taskActions.initialize(setTask);
      setLoading(false);
    }).catch((err) => {
      console.log(err)
      setError(true);
      setLoading(false);
    });

    return () => {
      taskActions.initialize(setTask);
    }
  }, [location]);

  if (!loading) {
    if (error) return <ErrorMsg />
    if (currentStep === 'pattern') return <PatternBuilder />
    else if (currentStep === 'layer') return <LayerBuilder />
    else if (currentStep === 'summary') return <Summary />

    return <div />
  }

  return <Loading />
};

export default TaskBuilderView;
