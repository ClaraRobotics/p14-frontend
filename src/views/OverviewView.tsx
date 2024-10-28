import React, { useState, useEffect } from 'react';
import { BiLayerPlus, BiListUl } from 'react-icons/bi';
import { IconContext } from 'react-icons';
import { useHistory } from 'react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { statusState, statusActions } from '@/store';
import { useRecoilState } from 'recoil';
import TaskStat from '@/components/statusdisplay/TaskStat';
import styled from 'styled-components';
import { systemState, taskState, taskActions } from '@/store';
import styles from '@/styles/styles';

import api from '@/api';
import BasicModal from '@/components/common/BasicModal';
import Button from '@/components/common/buttons/Button';
import Toggle from '../components/common/Toggle';
import Page from '@/components/common/Page';
import BoxSizePreview from '@/components/3Ddisplay/BoxSizePreview';
import dummyData from '@/components/3Ddisplay/dummyData';
import ManualControlButtons from '@/components/controlCenter/ManualControlButtons';
import UndoComponent from '@/components/controlCenter/UndoComponent';

import { IoIosCreate, IoIosCube } from 'react-icons/io';
import Row from '@/components/common/Row';
import PalletStack from '@/components/overview/PalletStack';
import { BsEject } from 'react-icons/bs';
import PalletStackWithControls from '@/components/overview/PalletStackWithControls';
import Conveyor from '@/components/overview/Conveyor';

import { BsArrowLeftSquareFill } from 'react-icons/bs';
import NumberDisplay from '@/components/text/NumberDisplay';
import VerticalPercentBar from '@/components/PercentBar/VerticalPercentBar';

import preloadBg from '@assets/img/CLARA.png';

import Column from '@/components/common/Column';
import { setLineIndex } from '@/store/task/actions';
const OverviewViewContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;
const OverviewContent = styled.div`
  padding-left: 50px;
  border-left: 1px solid ${styles.colors.gray6};
  flex: 1;
`;
const CreateTaskOptionContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const WhyDisabledText = styled.div<{
  show: boolean;
}>`
  display: ${(p) => (p.show ? 'block' : 'none')};
`;

const CreateTaskOption = styled.div`
  width: 30%;
  padding: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${styles.colors.gray3};

  &:active {
    color: ${styles.colors.gray4};
  }
`;

const CreateTaskOptionLabel = styled.div`
  margin-top: 8px;
  text-align: center;
`;

const CreateTaskOptionDivider = styled.div`
  height: 200px;
  margin: auto;
  border: 1px solid ${styles.colors.gray6};
`;

const OverViewDivider = styled.div`
  width: calc(100% - 20px);
  border: 1px solid ${styles.colors.gray6};
`;

const ConveyorBoxStatus = styled.div`
  position: relative;
  margin-top: 5px;
  // margin-bottom: 65px;
  width: 350px;
  height: 122px;
  // border: 2px solid ${styles.colors.gray6};
`;

const ConveyorLine = styled.div<{
  left: number;
  top: number;
  length: number;
  horizontal?: boolean;
}>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  width: ${(p) => (p.horizontal ? p.length + 'px' : '2px')};
  height: ${(p) => (p.horizontal ? '2px' : p.length + 'px')};
  background-color: ${styles.colors.gray4};
`;

const Separator = styled.div<{
  left: number;
  top: number;
  horizontal?: boolean;
}>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  width: ${(p) => (p.horizontal ? '90px' : '6px')};
  height: ${(p) => (p.horizontal ? '6px' : '90px')};
  background-color: ${styles.colors.gray4};
`;

const BoxPositionState = styled.div<{
  left: number;
  top: number;
  active: boolean;
}>`
  position: absolute;
  left: ${(p) => p.left}px;
  top: ${(p) => p.top}px;
  width: 40px;
  height: 30px;
  border: 2px ${(p) => (p.active ? 'solid' : 'dashed')} ${styles.colors.gray2};
  background-color: ${(p) => (p.active ? styles.colors.gray2 : 'none')};
`;

const DblStackerActive = styled.div<{ active: boolean }>`
  position: absolute;
  left: 60px;
  top: 5px;
  width: 300px;
  height: 30px;
  color: ${styles.colors.green};
  display: ${(p) => (p.active ? 'initial' : 'none')};
`;

const OverviewView = ({ t }: WithTranslation) => {
  const history = useHistory();
  const goToPatternBuilder = () => history.push('/pattern-builder');
  const goToTaskList = () => history.push('/existing-task');
  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilState(taskState);
  const [createTaskModalShow, setCreateTaskModalShow] = useState(false);

  const latestStatus = status.lastHeartBeatMessage;

  const onCreateTask = (line_index) => {
    setCreateTaskModalShow(true);
    taskActions.setLineIndex(task,setTask,line_index);
  }
  /* Preload 1 */
  const preload_texts = {
    unk: '( - ) กำลังเตรียมความพร้อมของระบบ',
    preload_check_ethernet: '(1/6) ตรวจสอบการเชื่อมต่อกับหุ่นยนต์',
    preload_check_emer: '(2/6) ตรวจสอบสถานะปุ่มหยุดฉุกเฉิน',
    preload_initialize_vars: '(3/6) ตั้งค่าตัวแปรระบบ',
    preload_gripper_release: '(4/6) ตรวจสอบที่จับกล่อง',
    preload_go_home: '(5/6) ขยับหุ่นยนต์กลับจุดพัก',
    preload_servo_home: '(6/6) ปรับขนาดที่จับกล่องเป็นค่าเริ่มต้น',
    error_ethernet:
      'ข้อผิดพลาด: หุ่นยนต์ปิดเครื่องอยู่ กรุณาบิดสวิทช์ที่ตู้หุ่นยนต์และรอประมาณสามนาที',
    error_emer:
      'ข้อผิดพลาด: มีปุ่มหยุดฉุกเฉินปุ่มใดปุ่มหนึ่งถูกกดอยู่ กรุณาปลดแล้วรอสักครู่',
    error_light_ct: 'ข้อผิดพลาด: ม่านแสงนิรภัยทำงาน กรุณาออกห่างจากจุดอันตราย',
  };
  const [isPreload, setIsPreload] = useState<boolean>(true);

  useEffect(() => {
    if (
      (latestStatus?.status_code ?? null) !== null &&
      latestStatus?.status_code.slice(0, 'preload_'.length) !== 'preload_' &&
      latestStatus?.status_code.slice(0, 'error_'.length) !== 'error_'
    ) {
      setIsPreload(false);
    }
    // test
    // setTimeout(()=>setIsPreload(false), 8000)
  }, [latestStatus]);
  /* end Preload 1 */

  let conveyor_enabled_A = latestStatus?.conveyorMotor?.[0]?.input === true;
  let conveyor_enabled_B = latestStatus?.conveyorMotor?.[1]?.input === true;

  let autoPalletMode = latestStatus?.autoPalletMode === true;
  let palletStockAmount = latestStatus?.palletStockAmount;
  let slipSheetStockAmount = latestStatus?.slipSheetStockAmount;
  const dangerTreshold = 0.3;

  return (
    <Page>
      {/* Preload 2 */}
      <div
        style={{
          display: isPreload ? 'flex' : 'none',
          zIndex: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          backgroundColor: '#013664',
          backgroundImage: `url(${preloadBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 160,
            width: '100%',
            textAlign: 'center',
            fontSize: '5em',
            color: '#fed787',
          }}
        >
          ระบบกำลังเริ่มทำงาน... <br />
          <span
            style={{
              fontSize: '0.5em',
              color:
                latestStatus?.status_code?.slice(0, 'error_'.length) ===
                'error_'
                  ? 'red'
                  : 'inherit',
            }}
          >
            {`${preload_texts[latestStatus?.status_code ?? 'unk']}`}
          </span>
        </div>
      </div>
      {/* end Preload 2 */}

      <OverviewViewContainer>
        {/* <div>
          layerIdx {latestStatus.layerIdx}<br/>
          boxIdx {latestStatus.boxIdx}<br/>
          finishLayerIdx {latestStatus.finishLayerIdx}<br/>
          finishBoxIdx {latestStatus.finishBoxIdx}<br/>
        </div> */}
        <OverviewContent
          style={{ width: 800, borderLeft: 'none', paddingLeft: 0 }}
        >
          <Row>
           <div style={{marginLeft:25}}> <PalletStackWithControls idx={1} /></div>
          </Row>
          <Row>
            <PalletStackWithControls idx={0} />
          </Row>
        </OverviewContent>
        <OverviewContent>
          <div style={{marginLeft:25}}><Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.inputconveyor')+" B"}
            </h1>
          </Row>
          <Row>
            <Column>
              <Toggle
                onLabel={t('common.on')}
                onValue={true}
                offLabel={t('common.off')}
                offValue={false}
                onToggle={(toggleValue: boolean) => {
                  api
                    .post('/robot/conveyor-enable-toggle', {
                      conveyorId: 1,
                      isEnable: toggleValue,
                    })
                    .then((res: any) => {});
                }}
                selected={conveyor_enabled_B}
                hilighted
              />
              <Button
                style={{ width: 150, marginLeft: 0 }}
                disabled={false}
                frontIcon={<IoIosCube />}
                label={'Clear'}
                onTap={() => {
                  api
                    .post('/robot/clear-state', { input: true,line_index:1 })
                    .then((res: any) => {});
                }}
              />
            
            </Column>
            <Column>
              <ConveyorBoxStatus style={{ backgroundColor: 'transparent' }}>
                <ConveyorLine left={30} top={0} length={280} horizontal />
                <ConveyorLine left={30} top={110} length={170} horizontal />
                <ConveyorLine left={200} top={110} length={0} />
                <ConveyorLine left={310} top={0} length={0} />
                <Separator left={30} top={10} />
                <Separator left={212} top={110} horizontal />

                <BoxPositionState
                  left={55}
                  top={65}
                  active={latestStatus?.conveyorBox?.[0]?.d == 2}
                />
                <BoxPositionState
                  left={55}
                  top={15}
                  active={
                    latestStatus?.conveyorBox?.[0]?.d == 3 ||
                    latestStatus?.conveyorBox?.[0]?.d == 4 ||
                    latestStatus?.conveyorBox?.[0]?.d == 5
                  }
                />

                </ConveyorBoxStatus>
            </Column>
          </Row>
          </div>
          <Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.inputconveyor')+" A"}
            </h1>
          </Row>
          <Row>
            <Column>
              <Toggle
                onLabel={t('common.on')}
                onValue={true}
                offLabel={t('common.off')}
                offValue={false}
                onToggle={(toggleValue: boolean) => {
                  api
                    .post('/robot/conveyor-enable-toggle', {
                      conveyorId: 0,
                      isEnable: toggleValue,
                    })
                    .then((res: any) => {});
                }}
                selected={conveyor_enabled_A}
                hilighted
              />
              <Button
                style={{ width: 150, marginLeft: 0 }}
                disabled={false}
                frontIcon={<IoIosCube />}
                label={'Clear'}
                onTap={() => {
                  api
                    .post('/robot/clear-state', { input: true ,line_index:0 })
                    .then((res: any) => {});
                }}
              />
            
            </Column>
            <Column>
              <ConveyorBoxStatus style={{ backgroundColor: 'transparent' }}>
                <ConveyorLine left={30} top={0} length={280} horizontal />
                <ConveyorLine left={30} top={110} length={170} horizontal />
                <ConveyorLine left={200} top={110} length={0} />
                <ConveyorLine left={310} top={0} length={0} />
                <Separator left={30} top={10} />
                <Separator left={212} top={110} horizontal />

                <BoxPositionState
                  left={55}
                  top={65}
                  active={latestStatus?.conveyorBox?.[0]?.d == 2}
                />
                <BoxPositionState
                  left={55}
                  top={15}
                  active={
                    latestStatus?.conveyorBox?.[0]?.d == 3 ||
                    latestStatus?.conveyorBox?.[0]?.d == 4 ||
                    latestStatus?.conveyorBox?.[0]?.d == 5
                  }
                />
                
              </ConveyorBoxStatus>
            </Column>
          </Row>
          <Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('pallet.pallet_slipsh')}
            </h1>
          </Row>
          <Row>
            <VerticalPercentBar
              label={t('maincomponent.overviewview.remaining_pallet')}
              percent={palletStockAmount / 100}
              color={
                palletStockAmount / 100 < dangerTreshold
                  ? styles.colors.danger2
                  : styles.colors.success1
              }
            />

            <VerticalPercentBar
              label={t('maincomponent.overviewview.remaining_slipsheet') + ' 1'}
              percent={slipSheetStockAmount?.[0] / 100}
              color={
                slipSheetStockAmount?.[0] / 100 < dangerTreshold
                  ? styles.colors.danger2
                  : styles.colors.success1
              }
            />
            <VerticalPercentBar
              label={t('maincomponent.overviewview.remaining_slipsheet') + ' 2'}
              percent={slipSheetStockAmount?.[1] / 100}
              color={
                slipSheetStockAmount?.[1] / 100 < dangerTreshold
                  ? styles.colors.danger2
                  : styles.colors.success1
              }
            />
          </Row>
        </OverviewContent>
        <OverviewContent>
          {/*JSON.stringify(task.robotSimulation)*/}
          {/*<BoxSizePreview dataToDisplay={dummyData.stackCenter} layerHeight={dummyData.layerHeight} />*/}
          <Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.current_task')}
            </h1>
          </Row>
          <TaskStat line_index={1}/>
          <TaskStat line_index={0}/>
          <OverViewDivider />
          <Button
            // disabled={
            //   latestStatus.finishBoxIdx?.some((x) => x != 0) ||
            //   latestStatus.finishLayerIdx?.some((x) => x != 0) ||
            //   ((latestStatus?.palletEnabled?.[0] !== true ||
            //     latestStatus?.palletState?.[0]?.mn == 6) && // wait load
            //     (latestStatus?.palletEnabled?.[1] !== true ||
            //       latestStatus?.palletState?.[1]?.mn == 6)) // wait load
            // }
            frontIcon={<IoIosCreate />}
            label={t('maincomponent.createtask.button')+" A"}
            onTap={()=>onCreateTask(0)}
          />
          <Button
            // disabled={
            //   latestStatus.finishBoxIdx?.some((x) => x != 0) ||
            //   latestStatus.finishLayerIdx?.some((x) => x != 0) ||
            //   ((latestStatus?.palletEnabled?.[0] !== true ||
            //     latestStatus?.palletState?.[0]?.mn == 6) && // wait load
            //     (latestStatus?.palletEnabled?.[1] !== true ||
            //       latestStatus?.palletState?.[1]?.mn == 6)) // wait load
            // }
            frontIcon={<IoIosCreate />}
            label={t('maincomponent.createtask.button')+" B"}
            onTap={()=>onCreateTask(1)}
          />
          {/* <WhyDisabledText
            show={
              (latestStatus?.palletEnabled?.[0] !== true ||
                latestStatus?.palletState?.[0]?.mn == 6) && // wait load
              (latestStatus?.palletEnabled?.[1] !== true ||
                latestStatus?.palletState?.[1]?.mn == 6) // wait load
            }
          >
            กรุณาโหลดพาเลท และเปิดพาเลท ก่อนเริ่มสั่งงานใหม่
          </WhyDisabledText> */}
          <ManualControlButtons />
          {/*Start of modal components*/}
          <BasicModal
            show={createTaskModalShow}
            onBackdropTap={() => setCreateTaskModalShow(false)}
            width="40%"
            left="30%"
            top="30%"
          >
            <CreateTaskOptionContainer>
              <CreateTaskOption onTouchEnd={goToPatternBuilder}>
                <IconContext.Provider
                  value={{
                    style: {
                      width: '72px',
                      height: '72px',
                    },
                  }}
                >
                  <BiLayerPlus />
                </IconContext.Provider>
                <CreateTaskOptionLabel>
                  {t('maincomponent.createtask.modal.option.new')}
                </CreateTaskOptionLabel>
              </CreateTaskOption>
              <CreateTaskOptionDivider />
              <CreateTaskOption onTouchEnd={goToTaskList}>
                <IconContext.Provider
                  value={{
                    style: {
                      width: '72px',
                      height: '72px',
                    },
                  }}
                >
                  <BiListUl />
                </IconContext.Provider>
                <CreateTaskOptionLabel>
                  {t('maincomponent.createtask.modal.option.existing')}
                </CreateTaskOptionLabel>
              </CreateTaskOption>
            </CreateTaskOptionContainer>
          </BasicModal>
        </OverviewContent>
      </OverviewViewContainer>
    </Page>
  );
};
export default withTranslation()(OverviewView);
