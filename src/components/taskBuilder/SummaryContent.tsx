import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toInteger } from 'lodash';
import { FaSave, FaWrench } from 'react-icons/fa';
import { AiOutlineWarning } from 'react-icons/ai';

import {
  statusState,
  statusActions,
  viewActions,
  viewState,
  systemState,
  taskState,
  taskActions,
} from '@/store';
import api from '@/api';

import Button from '@/components/common/buttons/Button';
import Field from '@/components/common/Field';
import Row from '@/components/common/Row';

import { useTranslation, WithTranslation, withTranslation } from 'react-i18next';
import { currentLineIndex, maxPossibleBoxesPerPallet } from '@/store/task/selectors';
import { InfoTextSmall } from '@/components/common/texts/InfoText';
import generatePayloadLayers from '@/util/generatePayloadLayers';
import Toggle from '../common/Toggle';

const Wrapper = styled.div`
  padding-left: 80px;
`;

const FieldBody = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px;
`;

const SummaryContent = () => {
  const { t } = useTranslation();
  const [task, setTask] = useRecoilState(taskState);
  const [status, setStatus] = useRecoilState(statusState);
  const system = useRecoilValue(systemState);
  const { boxDimension, palletDimension, stackHeight } = task;
  const history = useHistory();
  const [view, setView] = useRecoilState(viewState);
  const [isDryRun, setIsDryRun] = useState(false);

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };

  const valMaxPossibleBoxesPerPallet = useRecoilValue(
    maxPossibleBoxesPerPallet
  );


  const back = () => {
    taskActions.goToStep(task, setTask, 'layer');
  };

  const callAPISaveTask = (taskTitle: string) => {
    const payloadLayers = generatePayloadLayers(
      task,
      system,
      toInteger(valMaxPossibleBoxesPerPallet)
    );
    const saveTaskPayload = { ...payloadLayers, taskTitle: taskTitle };
    api
      .post('/save/task', saveTaskPayload)
      .then((res: any) => {
        setStatus({ ...status, taskTitle });
        // setStatus({
        //   ...status, taskTitle: [
        //     ...status.taskTitle.slice(0, valCurrentLineIndex),
        //     taskTitle,
        //     ...status.taskTitle.slice(valCurrentLineIndex + 1)
        //   ]
        // });
      })
      .catch((err: any) => {
        alert(err);
      });
    history.push('/');
  };

  const valCurrentLineIndex = useRecoilValue(
    currentLineIndex
  );

  const robotStart = () => {
    // grilled

    const payloadLayers = generatePayloadLayers(
      task,
      system,
      toInteger(maxPossibleBoxesPerPallet)
    );
    statusActions.setWriteJobLoading(status, setStatus, true);

    api
      .post('/robot/start-order', {
        ...payloadLayers,
        dryRun: isDryRun,
        line_index: valCurrentLineIndex
      })
      .then((res) => {
        let robotSimulation = res.data;

        statusActions.setCurrentTaskAndLoading(
          status,
          setStatus,
          robotSimulation,
          false,
          'Unspec. Order',
          valCurrentLineIndex
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

  const taskDetailContent = (
    <>
      {' '}
      <Field
        label={t('taskbuilder.summary.label.palletsize')}
        slot={
          <FieldBody>{`${palletDimension.width} x ${palletDimension.height} ${t(
            'common.mm'
          )}`}</FieldBody>
        }
        info
        labelCol={4}
      />
      <Field
        label={t('taskbuilder.summary.label.boxsize')}
        slot={
          <FieldBody>
            {`${boxDimension.width || system.boxMinWidth} x ${boxDimension.height || system.boxMinHeight
              } ${t('common.mm')}`}
          </FieldBody>
        }
        info
        labelCol={4}
      />
      <Field
        label={t('taskbuilder.summary.label.stackheight')}
        slot={
          <FieldBody>{`${stackHeight || 200} ${t('common.mm')}`}</FieldBody>
        }
        info
        labelCol={4}
      />
      <Field
        label={t('taskbuilder.summary.label.numberofbundles')}
        slot={
          task.boxAmount !== undefined ? (
            task.boxAmount <= valMaxPossibleBoxesPerPallet ? (
              <FieldBody>{task.boxAmount}</FieldBody>
            ) : (
              <FieldBody>
                {valMaxPossibleBoxesPerPallet}{' '}
                <InfoTextSmall>
                  &nbsp;
                  <AiOutlineWarning />
                  &nbsp;{t('validation.pallet.exceed.short')}
                </InfoTextSmall>
              </FieldBody>
            )
          ) : (
            <div>{valMaxPossibleBoxesPerPallet}</div>
          )
        }
        info
        labelCol={4}
      />
      <Field
        label={t('taskbuilder.layer.dbl_stacker')}
        slot={<FieldBody>{task.isDoubleStack ? t('common.yes') : t('common.no')}</FieldBody>}
        info
        labelCol={4}
      />
      <Field
        label={t('slipsheet.slipsheet')}
        slot={
          <FieldBody>
            {task.isSlipSheet
              ? `${t('common.every')} ${task.slipSheetEvery
              } ${t('taskbuilder.layer.title')}`
              : t('common.no')}
          </FieldBody>
        }
        info
        labelCol={4}
      />
    </>
  );

  return (
    <Wrapper>
      <h1>{t('taskbuilder.summary.title')}</h1>
      {taskDetailContent}
      <Field
        label={t('taskbuilder.layer.test_run')}
        slot={
          <FieldBody>
            <Toggle
              onLabel={t('common.on')}
              onValue={true}
              offLabel={t('common.off')}
              offValue={false}
              onToggle={setIsDryRun}
              selected={isDryRun}
            />
          </FieldBody>
        }
        info
        labelCol={4}
      />
      <Row style={{ paddingTop: '40px' }}>
        <Button label={t('common.back')} className="secondary" onTap={back} />
        {status.writeJobLoading ? (
          <Button label={`${t('common.processing')}...`} disabled />
        ) : (
          <Button
            label={t('taskbuilder.summary.button.start')}
            rearIcon={<FaWrench />}
            onTap={
              //() => checkEmerThenCallAction(() => robotStart())
              // )
              () => {
                robotStart()
                history.push('/');
            }}
          />
        )}
      </Row>
    </Wrapper>
  );
};

export default withTranslation()(SummaryContent);