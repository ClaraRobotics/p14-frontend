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
  margin-left: 68px;
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
const SpeedIconWrapper = styled.div`
  transition: all 0.3s ease;
  transform-origin: center;
  transform: ${props => props.isHighSpeed ? 'scale(1.1)' : 'scale(1)'};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px; 
  height: 24px; 
`;

// const SpeedSvg = styled.svg`
//   width: 24px;
//   height: 24px;
//   fill: ${styles.colors.gray2};
// `;

const RabbitIcon = () => (
  <svg 
    fill={styles.colors.gray2} 
    height="300px"
    width="300px"
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg"  
    viewBox="0 0 512 512"
    style={{ transform: 'scale(2)', transformOrigin: 'center center' }} 
  >
    <g>
      <g>
        <path d="M472.345,355.081c-8.729-64.995-64.55-115.272-131.883-115.272h-114.33c1.894-4.349,3.618-8.803,5.121-13.363
          c1.979-5.967,2.973-12.199,2.973-18.526c0-4.793-0.571-9.596-1.693-14.347c13.712-9.078,27.72-20.653,40.935-33.857
          c20.155-20.166,36.396-42.057,45.717-61.641c13.955-29.318,8.221-44.13,0.963-51.399c-7.269-7.258-22.092-13.003-51.409,0.952
          c-3.036,1.439-6.137,3.068-9.268,4.846c-0.159-24.356-7.332-40.067-20.928-45.008c-28.969-10.485-63.482,37.422-82.611,90.186
          c-5.269,14.527-9.332,29.307-11.935,43.242c-59.154,7.142-107.506,45.527-126.138,101.877c-1.979,5.967-2.973,12.199-2.973,18.526
          c0,26.916,17.521,51.991,42.353,62.73c-6.147,15.5-9.258,31.889-9.258,48.87c0,20.187,4.518,39.845,13.162,57.758H37.666
          C16.897,430.656,0,447.552,0,468.321c0,20.758,16.897,37.655,37.666,37.655l302.797,0.011c35.539,0,68.952-13.839,94.111-38.978
          c6.888-6.898,12.919-14.41,18.05-22.42c4.317,1.312,8.824,2.021,13.384,2.021c25.361,0,45.992-20.631,45.992-45.982
          C512,377.416,494.712,358.181,472.345,355.081z M175.823,104.868c20.642-56.932,48.246-80.135,55.493-77.511
          c3.365,1.217,8.993,12.495,6.263,39.496c-10.252,7.65-20.568,16.6-30.471,26.504c-15.087,15.077-27.89,31.011-37.391,46.447
          c-1.016-0.063-3.618-0.127-3.915-0.127C168.194,128.388,171.58,116.559,175.823,104.868z M438.552,426.878
          c-5.036,9.12-11.384,17.595-18.949,25.17c-21.15,21.139-49.251,32.778-79.14,32.778H224.164v-0.011
          c-9.099,0-16.505-7.396-16.505-16.495c0-9.11,7.406-16.505,16.505-16.505h47.886c5.84,0,10.58-4.74,10.58-10.58v-17.923
          c0-29.529,24.017-53.547,53.547-53.547h13.987c5.84,0,10.58-4.74,10.58-10.58c0-5.851-4.74-10.58-10.58-10.58h-13.987
          c-41.2,0-74.707,33.508-74.707,74.707v7.343h-37.306c-20.769,0-37.666,16.897-37.666,37.666c0,5.914,1.375,11.511,3.82,16.495
          H37.666c-9.099,0-16.505-7.396-16.505-16.495c0-9.11,7.406-16.505,16.505-16.505h41.718c2.031,0,4.084-0.582,5.904-1.809
          c4.846-3.259,6.126-9.84,2.867-14.685c-12.442-18.463-19.013-40.057-19.013-62.424c0-17.754,4.031-34.735,11.987-50.457
          c2.645-5.206,0.55-11.575-4.655-14.22c-0.815-0.402-1.651-0.688-2.497-0.878c-10.633-2.359-20.113-8.591-26.937-16.876
          c-6.824-8.284-10.993-18.621-10.993-29.17c0-4.063,0.635-8.073,1.904-11.892c8.76-26.482,25.202-48.786,47.548-64.497
          c22.42-15.743,49.611-24.07,78.654-24.07c0.751,0,6.941,0.275,9.3,0.698c4.55,0.804,8.93-1.428,11.067-5.237l0.011,0.011
          c8.697-15.426,22.028-32.471,37.539-47.992c10.284-10.284,20.959-19.404,31.413-26.906c0.222-0.148,0.434-0.296,0.635-0.455
          c8.147-5.809,16.156-10.623,23.721-14.22c16.124-7.671,25.192-7.258,27.339-5.1c2.158,2.158,2.582,11.215-5.1,27.35
          c-8.316,17.457-23.076,37.264-41.57,55.758c-13.754,13.754-28.345,25.541-42.3,34.164l0.095,0.159
          c-4.222,1.608-6.814,5.629-6.814,9.893c0,1.248,0.222,2.518,0.688,3.756c1.915,5.036,2.888,10.146,2.888,15.204
          c0,4.063-0.645,8.073-1.904,11.892c-2.941,8.909-6.771,17.383-11.384,25.213c-2.963,5.036-1.28,11.522,3.756,14.484
          c1.682,0.995,3.534,1.46,5.354,1.46h131.576c61.715,0,111.918,50.214,111.918,111.929
          C452.38,399.084,438.711,426.54,438.552,426.878z M466.008,425.45c-1.047,0-2.095-0.074-3.132-0.201
          c6.475-15.13,10.094-31.445,10.601-48.31c10.051,3.185,17.362,12.591,17.362,23.689C490.839,414.32,479.698,425.45,466.008,425.45
          z"/>
      </g>
    </g>
    <g>
      <g>
        <circle cx="102.311" cy="223.497" r="12.823"/>
      </g>
    </g>
    <g>
      <g>
        <path d="M340.457,276.841c-5.842,0-10.58,4.738-10.58,10.58c0,5.842,4.738,10.58,10.58,10.58
          c41.297,0,74.895,33.598,74.895,74.894c0,5.842,4.738,10.58,10.58,10.58s10.58-4.738,10.58-10.58
          C436.512,319.931,393.423,276.841,340.457,276.841z"/>
      </g>
    </g>
  </svg>
);

const TortoiseIcon = () => (
  <svg 
    fill={styles.colors.gray2} 
    height="300px"
    width="300px"
    version="1.1" 
    id="Capa_1" 
    xmlns="http://www.w3.org/2000/svg"  
    x="0px" 
    y="0px"
    viewBox="0 0 431.347 431.347"
    style={{ transform: 'scale(2)', transformOrigin: 'center center' }}
  >
    <path id="XMLID_47_" d="M60.177,103.279v-18h17.564v18H60.177z M195.34,310.388c-12.314-17.736-36.526-49.441-60.314-62.499
      c-21.169-11.621-34.072-3.648-39.881,2.138l12.705,12.751c2.254-2.247,5.523-4.211,12.662-1.757
      c14.05,4.827,33.989,23.833,54.706,52.146c14.808,20.237,24.831,38.142,28.947,47.45c-10.541,1.535-25.629-0.151-41.676-4.841
      c-22.353-6.534-42.723-17.648-55.888-30.492c-14.992-14.627-19.483-29.964-13.35-45.585l2.325-5.92l-4.805-4.168
      c-16.492-14.305-24.906-30.681-25.007-48.673l-0.41-73.931h-8.95C35.229,147.005,18,129.776,18,108.6
      c0-21.176,17.229-38.405,38.405-38.405h23.701c8.845,0,14.106,7.764,14.733,15.437c0.111,1.366,0.122,3.688,0.133,6.145
      c0.052,11.392,0.123,26.993,7.953,35.816l13.463-11.948c-3.324-3.745-3.389-17.903-3.416-23.949
      c-0.013-2.938-0.024-5.474-0.193-7.53c-1.487-18.226-15.533-31.97-32.673-31.97H56.405C25.304,52.195,0,77.498,0,108.6
      c0,28.055,20.59,51.392,47.451,55.695l0.314,56.742c0.12,21.315,9.339,41.285,26.74,58.08c-5.563,20.448,1.234,41.203,19.526,59.049
      c15.206,14.835,38.316,27.551,63.407,34.885c13.872,4.055,26.937,6.101,38.207,6.101c8.977,0,16.815-1.298,23.016-3.911l4.292-1.809
      l1.002-4.548c0.738-3.352,0.807-8.298-7.786-24.665C210.85,334.086,203.452,322.07,195.34,310.388z M317.151,276.567
      c-9.628-3.972-23.822-6.079-34.781-0.089c-6.743,3.686-11.061,9.793-12.485,17.663l17.711,3.208
      c0.447-2.467,1.498-4.032,3.406-5.076c4.243-2.319,12.354-1.926,19.286,0.934c23.851,9.838,49.97,47.685,58.715,65.336
      c-21.86-0.602-56.692-9.203-74.321-24.043c-6.542-5.507-9.923-11.23-10.051-17.011l-0.151-6.817l-6.603-1.7
      c-10.733-2.764-43.312-6.911-64.873,6.895l9.705,15.159c12.381-7.927,32.896-7.559,44.891-5.756
      c2.028,8.324,7.215,16.035,15.49,23.001c22.309,18.779,63.577,28.252,88.795,28.251c3.884,0,7.391-0.225,10.385-0.675l6.119-0.92
      l1.332-6.043c2.563-11.627-16.183-38.507-21.989-46.469C357.999,309.07,338.485,285.367,317.151,276.567z M429.473,219.554
      c-9.41,31.17-31.051,56.212-68.094,78.796l-9.369-15.369c26.69-16.272,44.311-33.632,54.342-53.771
      c-57.392,10.891-134.155,11.81-158.058,11.81c-55.169,0-109.044-6.086-155.803-17.602l-6.188-1.524l-0.618-6.342
      c-0.305-3.128-0.459-6.282-0.459-9.372c0-33.767,17.305-65.342,48.726-88.907c30.646-22.985,71.254-35.643,114.342-35.643
      c78.001,0,145.128,42.18,160.02,100.416c0.938,0.727,3.139,1.851,4.656,2.625C420.716,188.624,436.821,196.841,429.473,219.554z
      M123.917,211.837c1.899-16.608,8.691-33.886,19.649-49.651c10.612-15.269,24.015-27.674,37.469-34.829V111.79
      c-46.214,17.838-77.809,53.457-77.809,94.391c0,0.432,0.004,0.865,0.011,1.3C109.99,209.047,116.893,210.5,123.917,211.837z
      M239.294,222.964l-0.002-51.875l-48.962-28.27c-20.266,10.445-45.607,40.264-48.656,72.106
      C172.617,219.818,205.625,222.55,239.294,222.964z M297.551,127.06v-21.068c-15.683-4.175-32.345-6.362-49.257-6.362
      c-17.283,0-33.874,2.232-49.259,6.324v21.107l49.257,28.44L297.551,127.06z M360.417,217.54
      c-3.834-30.818-31.886-63.651-53.465-75.123l-49.66,28.672l0.002,51.894C289.097,222.728,326.513,221.115,360.417,217.54z
      M404.788,200.704c-5.304-2.707-11.904-6.075-13.749-13.548c-5.905-23.911-23.124-45.881-48.484-61.865
      c-8.34-5.256-17.405-9.761-27.004-13.463v14.795c25.711,13.885,58.102,50.938,62.744,88.798c12.668-1.684,24.548-3.685,35.09-6.04
      C413.619,205.41,411.041,203.895,404.788,200.704z"/>
  </svg>
);

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

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const robotSpeed = () => {
    if (isCountingDown) return;

    api
      .post('/robot/change-robot-speed', { speed: latestStatus.robotSpeed === 1 ? 0 : 1 })
      .then((res) => {
        console.log('Robot speed changed successfully');
      })
      .catch((err) => {
        console.error('Error changing robot speed:', err);
      });
  
    setIsCountingDown(true);
    setCountdown(5);
  
    const countdownInterval = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownInterval);
          setIsCountingDown(false);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
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
          onTap={holdRobot}
        />
        <Divider />
        <ControlButton
            icon={
              isCountingDown ? (
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{countdown}</div>
              ) : (
                <SpeedIconWrapper isHighSpeed={latestStatus.robotSpeed === 1}>
                  {latestStatus.robotSpeed === 1 ? <RabbitIcon /> : <TortoiseIcon />}
                </SpeedIconWrapper>
              )
            }
            style={{
              width: 112,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            label={isCountingDown ? '...' : t('control.button.change_speed')}
            onTap={robotSpeed}
            disabled={isCountingDown}
          />
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
          {t('pallet.pallets')}
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
          latestStatus.alarm?.all ?           <Red>{t('navbar.status.robotstatus.robot.alarm')}</Red> : 
          !latestStatus.emergency?.all ?      <Red>{t('statusbar.emer_stopped')}</Red> : 
          latestStatus.servo_on && 
          !latestStatus.running ?             <Yellow>{t('controlcenter.button.pause.label')}</Yellow> :
          !latestStatus.servo_on && 
          status_code == 'running_line' ?     <Yellow>{t('controlcenter.button.pause.label')}</Yellow> :
            [ // status that has yellow text
              'order_write_job'
            ].includes(status_code) ?           
              <Yellow>{t('robotstatus.code.order_write_job')}</Yellow> :
            status_code?.startsWith('order_write_dyn_height') ?         
              <Yellow>{t('robotstatus.code.order_write_dyn_height')} {status_code.split('_')[4]}/{status_code.split('_')[5]}</Yellow> :
            status_code == 'idle' ? 
              <>{t('robotstatus.code.idle')}</> :
            status_code == 'running_line' ? 
              <>{t('robotstatus.code.running_line')}</> :
            status_code == 'play_job' ? 
              <>{t('robotstatus.code.play_job')}</> :
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