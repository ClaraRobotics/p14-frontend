import React, { useState } from 'react';
import styled from 'styled-components';
import { withTranslation, WithTranslation } from 'react-i18next';
import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';
import { AiFillControl } from 'react-icons/ai';
import { MdLayersClear } from 'react-icons/md';

import ControlButton from '@/components/common/buttons/ControlButton';
import styles from '@/styles/styles';
import Button from '../common/buttons/Button';
import { BrowserWindow } from 'electron';
import AlertModal from '../common/AlertModal';
import ExitKioskMode from './ExitKioskMode';
import RobotControlComponent from './RobotControlComponent';
import { statusState, viewState, viewActions } from '@/store';
import { useRecoilState } from 'recoil';
import api from '@/api';

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 140px;
  display: flex;
  justify-content: space-between;
  padding: 24px 40px 0 40px;
  margin-top: 40px;
  border-top: 1px solid ${styles.colors.gray6};
  background-color: ${styles.colors.gray8};
`;

const LeftBtnGroup = styled.div`
  display: flex;
  flex: 1;
`;
const RightBtnGroup = styled.div`
  display: flex;
  justify-content: right;
  width: 150px;
  margin-left: auto;
`;

const Divider = styled.div`
  margin: 20px;
`;

const RobotStatusContainer = styled.div`
  padding: 2px 24px;
  height: 88px;
  width: 500px;
  max-width: 70%;
  border: 2px solid ${styles.colors.gray6};
  line-height: 24px;
  margin-left: 340px;
  display: flex;
  font-size:0.9em;
`;

const RobotStatusLabel = styled.div`
  margin: auto;
  font-size: 38px;
  color: ${styles.colors.gray2};
`;

const RobotStatusValue = styled.div<{status?: boolean}>`
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: ${p =>
    p.status ? styles.colors.gray3 : styles.colors.gray4};
`;

const ControlBar = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const latestStatus = status.lastHeartBeatMessage;

  const status_code_texts = {
    unk: 'สถานะหุ่นยนต์',
    idle: 'สถานะหุ่นยนต์: ว่าง',
    going_home: 'กลับจุดพัก',
    writing_job: 'กำลังตั้งงาน',
    writing_job_dyn_height: 'กำลังตั้งระบบปรับความสูง',
    gripper_set_position: 'ระบบหยิบวางพร้อม',
    playing_job: 'ระบบหยิบวางทำงาน'
  };

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };
  const endStack = () => {
    //TODO handle error

    // statusActions.setCurrentTask(status, setStatus, {});
    api
      .get('/robot/end-order')
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };

  const startRobot = () => {
    console.log('start robot!');
    if (
      latestStatus.running_job?.job_name?.slice(0, 5) == 'LINE_' ||
      latestStatus.running_job?.job_name?.slice(0, 9) == 'RUN_STACK' ||
      latestStatus.running_job?.job_name?.slice(0, 5) == 'PICK_'
    ) {
      api
        .get('/robot/start')
        .then((res) => {})
        .catch((err) => {});
    }
    else {
      api
        .post('/robot/play-job', { job: 'RUN_STACK' })
        .then((res: any) => {})
        .catch((err: any) => {
          alert(err);
        })
    }
  };

  const holdRobot = () => {
    api
      .get('/robot/hold')
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <Container>
      <LeftBtnGroup>
        <ControlButton
          icon={<BsFillPlayFill />}
          label={t('controlbar.button.start')}
          onTap={() => {checkEmerThenCallAction(startRobot)}}
          color={styles.colors.green}
        />
        <Divider />
        <ControlButton
          icon={<BsPauseFill />}
          label={t('controlbar.button.pause')}
          onTap={() => {holdRobot()}}
        />
        <Divider />
        <ControlButton
          icon={<MdLayersClear />}
          label={t('controlbar.button.end')}
          onTap={() => {checkEmerThenCallAction(endStack)}}
        />
      <RobotStatusContainer>
        <RobotStatusLabel>
          {
            latestStatus.servo_on === true && latestStatus.running === false ?
              <span style={{ color: styles.colors.primary2 }}>
                หุ่นยนต์หยุดชั่วคราว
              </span>
              :
              (
                status_code_texts[latestStatus['status_code']] ||
                t('navbar.status.robotstatus.robot.nomsg')
              )
          }
        </RobotStatusLabel>
        {/* <RobotStatusValue status={!!status.lastHeartBeatMessage['status_code']}>

        </RobotStatusValue> */}
      </RobotStatusContainer>
      </LeftBtnGroup>
      <RightBtnGroup>
        <RobotControlComponent />
      </RightBtnGroup>
    </Container>
  );
};

export default withTranslation()(ControlBar);
