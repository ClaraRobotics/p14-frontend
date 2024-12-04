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
  width: 700px;
  border: 2px solid ${styles.colors.gray6};
  line-height: 24px;
  margin-left: 180px;
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

const Green = styled.span`
  color: ${styles.colors.green};
`

const Yellow = styled.span`
  color: ${styles.colors.primary2};
`

const Red = styled.span`
  color: ${styles.colors.danger2};
`



const ControlBar = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const latestStatus = status.lastHeartBeatMessage;

  const palletStockAmount = latestStatus?.palletStockAmount;

  const status_code_texts = {
    idle: 'หุ่นยนต์ว่าง',
    order_write_job: 'กำลังตั้งค่าหุ่นยนต์ (ระบบหยิบวาง)',
    order_write_dyn_height: 'กำลังตั้งค่าหุ่นยนต์ (ระบบปรับความสูง)',
    running_line: 'หุ่นยนต์กำลังทำงาน (ระบบหยิบวาง)',
    play_job: 'หุ่นยนต์กำลังทำงาน (คำสั่งทั่วไป)'
  };

  const status_code = latestStatus['status_code'];

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };

  const endStack = (line_index) => {
    //TODO handle error

    // statusActions.setCurrentTask(status, setStatus, {});
    api
      .post('/robot/end-order',{line_index:line_index})
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };

  const startRobot = () => {
    console.log('start robot!');
    if (
      latestStatus.running_job?.job_name?.slice(0, 5) == 'LINE_' ||
      latestStatus.running_job?.job_name?.slice(0, 4) == 'RUN_'  ||
      latestStatus.running_job?.job_name?.slice(0, 5) == 'PICK_'
    ) {
      api
        .get('/robot/start')
        .then((res) => {})
        .catch((err) => {});
    }
    else {
      api
        .post('/robot/play-job', { job: 'ENTER_RUN_STACK' })
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
        <Divider />
        <div style={{width: 100, textAlign: 'center'}}>
          <span 
            style={{
              fontSize: '3rem', 
              color: palletStockAmount < 30 ? styles.colors.danger2 : styles.colors.green
            }}
          >
            {parseInt(palletStockAmount)}%
          </span><br/>
          Pallets
        </div>
        {/* <Divider />
        <ControlButton
          icon={<MdLayersClear />}
          label={t('controlbar.button.end')+"A"}
          onTap={() => {checkEmerThenCallAction(()=>endStack(0))}}
        />
        <Divider />
                <ControlButton
          icon={<MdLayersClear />}
          label={t('controlbar.button.end')+"B"}
          onTap={() => {checkEmerThenCallAction(()=>endStack(0))}}
        /> */}
      <RobotStatusContainer>
        <RobotStatusLabel>
          {
            latestStatus.alarm?.all ?           <Red>หุ่นยนต์ขึ้นสัญญาณเตือน</Red> : 
            latestStatus.emergency?.all ?       <Red>หุ่นยนต์หยุดทำงาน</Red> : 
            latestStatus.servo_on && 
            !latestStatus.running ?             <Yellow>หุ่นยนต์หยุดชั่วคราว</Yellow> :
            !latestStatus.servo_on && 
            status_code == 'running_line' ?     <Yellow>หุ่นยนต์หยุดชั่วคราว</Yellow> :
            [ // status that has yellow text
              'order_write_job'
            ].includes(status_code) ?           <Yellow>{status_code_texts[status_code]}</Yellow> :
            status_code?.startsWith(
            'order_write_dyn_height') ?         <Yellow>{status_code_texts.order_write_dyn_height} {status_code.split('_')[4]}/{status_code.split('_')[5]}</Yellow> :
            status_code in status_code_texts ?  <>{status_code_texts[status_code]}</> :
            t('navbar.status.robotstatus.robot.nomsg')
          }
        </RobotStatusLabel>
      </RobotStatusContainer>
      </LeftBtnGroup>
      <RightBtnGroup>
        <RobotControlComponent />
      </RightBtnGroup>
    </Container>
  );
};

export default withTranslation()(ControlBar);
