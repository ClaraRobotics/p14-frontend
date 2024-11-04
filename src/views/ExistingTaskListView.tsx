import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { pick, toInteger } from 'lodash';

import CancelButton from '@/components/common/buttons/CancelButton';
import Page from '@/components/common/Page';
import TaskItem from '@/components/taskBuilder/TaskItem';
import Toggle from '@/components/common/Toggle';

import { useEffect } from 'react';
import api from '@/api';
import Field from '@/components/common/Field';
import TextInput from '@/components/common/input/TextInput';
import AlertModal from '@/components/common/AlertModal';
import { useRecoilState } from 'recoil';
import { statusState, statusActions, viewActions, viewState } from '@/store';
import { maxPossibleBoxesPerPallet } from '@/store/task/selectors';
import generatePayloadLayers from '@/util/generatePayloadLayers';
import { Task } from '@/types/task';

const TaskListContainer = styled.div`
  padding: 0 12px 120px 12px;
  margin-top: 24px;
  overflow-y: scroll;
`;
const SearchContainer = styled.div`
  width: 600px;
`;
const ExistingTaskListView = () => {
  const history = useHistory();
  const onCancel = () => history.push('/');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const [isShowTaskPreview, setIsShowTaskPreview] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [isDryRun, setIsDryRun] = useState(false);


  useEffect(() => {
    api
      .get('/load/all-tasks')
      .then((res) => {
        setTaskList(res.data);
      })
      .catch((err) => {});
  }, []);
  const [status, setStatus] = useRecoilState(statusState);

  const robotStart = (task: Task, line_index) => {
    // grilled

    const payloadLayers = task;
    console.log('Payloadlayers:', payloadLayers);
    statusActions.setWriteJobLoading(status, setStatus, true);

    api
      .post('/robot/start-order', {
        ...payloadLayers,
        dryRun: isDryRun,
        line_index: line_index
      })
      .then((res) => {
        let robotSimulation = res.data;

        console.log({ robotSimulation });
        console.log('write-job sent.');

        statusActions.setCurrentTaskAndLoading(
          status,
          setStatus,
          robotSimulation,
          false,
          payloadLayers.taskTitle
        );
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data.message);

          console.log(err.response.status);
          console.log(err.response.headers);
        }
        console.log(err);
      });

    // end grilled
  };

  const filteredTask = taskList
  .filter((data: Task) => {
    if (searchKeyword !== '') {
      return (
        data.taskTitle
          .toLocaleLowerCase()
          .replace(/\s/g, '')
          .search(
            searchKeyword.toLocaleLowerCase().replace(/\s/g, '')
          ) != -1
      );
    } else return true;
  })
  const [view, setView] = useRecoilState(viewState);

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };
  return (
    <Page>
      <CancelButton onTap={onCancel} />
      <SearchContainer>
        <Field
          label="Search"
          slot={
            <TextInput
              value={searchKeyword}
              onChange={setSearchKeyword}
              label={''}
            ></TextInput>
          }
        />
      </SearchContainer>
      <TaskListContainer>
        {filteredTask
          .map((task, index) => {
            return (
              <TaskItem
                task={task}
                onTap={() => {
                  setCurrentTaskId(index);
                  setIsShowTaskPreview(true);
                }}
              />
            );
          })}
      </TaskListContainer>

      <AlertModal
        show={isShowTaskPreview}
        actionButtonLabel="LOAD"
        subButtonLabel="Cancel"
        onSubButtonTap={() => {
          setIsShowTaskPreview(false);
        }}
        onActionButtonTap={() => {
          setIsShowTaskPreview(false);
          checkEmerThenCallAction(() => {
            robotStart(filteredTask[currentTaskId], 1) //TODO LOAD LINE_LINDEX

            history.push('/')
            // viewActions.checkEmptyPalletThenCall(
            //   view,
            //   setView,
            //   status,
              // ()=>
            // )
          })
        }}
      >
        {filteredTask[currentTaskId] !== undefined && (
          <TaskItem task={filteredTask[currentTaskId]} />
        )}
        <br/>
        คำสั่งพิเศษ <Toggle
            onLabel={'วิ่งทดสอบ'}
            onValue={true}
            offLabel={'ปิด'}
            offValue={false}
            onToggle={setIsDryRun}
            selected={isDryRun}
          />
      </AlertModal>
    </Page>
  );
};

export default ExistingTaskListView;
