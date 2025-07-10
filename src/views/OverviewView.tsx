import React, { useState, useEffect, ReactElement } from 'react';
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
import { GrVmMaintenance } from 'react-icons/gr';

declare global {
  interface String {
    replaceJSX(from: string, to: ReactElement): Array<string | ReactElement>;
  }
}

String.prototype.replaceJSX = function (from: string, to: ReactElement) {
  to = React.cloneElement(to, { key: '0' });

  return this.split(from).flatMap(e => [e, to]).slice(0, -1)
}

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
  width: 350px;
  height: 122px;
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

const MaintenanceButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 30px;
  font-size: 0.6rem;
  z-index: 1000;
`;

const Green = styled.span`
  color: ${styles.colors.green};
`;

const Red = styled.span`
  color: ${styles.colors.danger2};
`;

const OverviewView = ({ t }: WithTranslation) => {
  const history = useHistory();
  const goToPatternBuilder = () => history.push('/pattern-builder');
  const goToTaskList = () => history.push('/existing-task');
  const [status, setStatus] = useRecoilState(statusState);
  const [task, setTask] = useRecoilState(taskState);
  const [createTaskModalShow, setCreateTaskModalShow] = useState(false);

  const [loadingStates, setLoadingStates] = useState({
    conveyorToggle: { isLoading: false, conveyorId: null },
    clearState: { isLoading: false, lineIndex: null },
    maintenance: false,
    createTask: false
  });

  const latestStatus = status.lastHeartBeatMessage;

  const onCreateTask = (line_index) => {
    setCreateTaskModalShow(true);
    taskActions.setLineIndex(task, setTask, line_index);
  }

  const handleApiCall = async (
    apiCall: () => Promise<any>,
    loadingKey: string,
    additionalData: any = null,
    successMessage: string = 'สำเร็จ'
  ) => {
    try {
      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: additionalData ? { isLoading: true, ...additionalData } : true
      }));

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      await Promise.race([apiCall(), timeoutPromise]);

      console.log(successMessage);

      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: additionalData ? { isLoading: false, ...additionalData } : false
      }));

    } catch (error) {
      console.error('API call failed:', error);
      alert(error.message === 'Request timeout' ? 'คำขอหมดเวลา กรุณาลองใหม่อีกครั้ง' : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      
      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: additionalData ? { isLoading: false, ...additionalData } : false
      }));
    }
  };

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
  }, [latestStatus]);
  /* end Preload 1 */

  console.log('latestStatus', latestStatus)

  let conveyor_enabled = latestStatus?.conveyorEnabled ?? ([false, false]);
  let pallet_enabled = latestStatus?.palletEnabled ?? ([false, false]);
  let pallet_operating = latestStatus?.palletOperating ?? ([false, false]);
  let curent_order = latestStatus?.currentOrder ?? ([99, 99]);
  let curent_task = status.currentTask;

  const preloadError = Object.values(preload_texts).some(text => text !== '');

  const goMaintenance = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'BTN_GO_MAINTENANCE' }),
      'maintenance',
      null,
      'เข้าสู่โหมดบำรุงรักษาสำเร็จ'
    );
  };

  const handleConveyorToggle = (conveyorId: number, isEnable: boolean) => {
    handleApiCall(
      () => api.post('/robot/conveyor-enable-toggle', { conveyorId, isEnable }),
      'conveyorToggle',
      { conveyorId },
      `${isEnable ? 'เปิด' : 'ปิด'}สายพานที่ ${conveyorId + 1} สำเร็จ`
    );
  };

  const handleClearState = (line_index: number) => {
    handleApiCall(
      () => api.post('/robot/clear-state', { input: true, line_index }),
      'clearState',
      { lineIndex: line_index },
      `เคลียร์สถานะไลน์ ${line_index + 1} สำเร็จ`
    );
  };

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
          {preloadError && (
            <MaintenanceButton
              onTap={() => goMaintenance()}
              frontIcon={<GrVmMaintenance />}
              label={loadingStates.maintenance ? 
                t('component.common.loading.text') + '...' : 
                'บำรุงรักษา'}
              doubleLine
              disabled={loadingStates.maintenance}
            />
          )}
        </div>
      </div>
      {/* end Preload 2 */}

      <OverviewViewContainer>
        <OverviewContent
          style={{ width: 800, borderLeft: 'none', paddingLeft: 0 }}
        >
          <Row>
            <PalletStackWithControls idx={0} />
          </Row>
          <Row style={{marginLeft: 30}}>
            <PalletStackWithControls idx={1} />
          </Row>
        </OverviewContent>
        <OverviewContent>
          <Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.inputconveyor') + " A"}
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
                  handleConveyorToggle(0, toggleValue);
                }}
                selected={conveyor_enabled[0]}
                hilighted
                disabled={loadingStates.conveyorToggle.isLoading && loadingStates.conveyorToggle.conveyorId === 0}
              />
              <Button
                style={{ width: 150, marginLeft: 0 }}
                disabled={loadingStates.clearState.isLoading && loadingStates.clearState.lineIndex === 0}
                frontIcon={<IoIosCube />}
                label={loadingStates.clearState.isLoading && loadingStates.clearState.lineIndex === 0 ? 
                  t('component.common.loading.text') + '...' : t('common.clear')}
                onTap={() => handleClearState(0)}
              />
            </Column>
            <Column>
              <ConveyorBoxStatus style={{ backgroundColor: 'transparent' }}>
                <ConveyorLine left={30} top={0} length={280} horizontal />
                <ConveyorLine left={30} top={110} length={280} horizontal />
                <ConveyorLine left={200} top={110} length={0} />
                <ConveyorLine left={310} top={0} length={0} />
                <Separator left={30} top={10} />

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
          <Row style={{marginLeft: 30}}>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.inputconveyor') + " B"}
            </h1>
          </Row>
          <Row style={{marginLeft: 30}}>
            <Column>
              <Toggle
                onLabel={t('common.on')}
                onValue={true}
                offLabel={t('common.off')}
                offValue={false}
                onToggle={(toggleValue: boolean) => {
                  handleConveyorToggle(1, toggleValue);
                }}
                selected={conveyor_enabled[1]}
                hilighted
                disabled={loadingStates.conveyorToggle.isLoading && loadingStates.conveyorToggle.conveyorId === 1}
              />
              <Button
                style={{ width: 150, marginLeft: 0 }}
                disabled={loadingStates.clearState.isLoading && loadingStates.clearState.lineIndex === 1}
                frontIcon={<IoIosCube />}
                label={loadingStates.clearState.isLoading && loadingStates.clearState.lineIndex === 1 ? 
                  t('component.common.loading.text') + '...' : t('common.clear')}
                onTap={() => handleClearState(1)}
              />
            </Column>
            <Column>
              <ConveyorBoxStatus style={{ backgroundColor: 'transparent' }}>
                <ConveyorLine left={30} top={0} length={280} horizontal />
                <ConveyorLine left={30} top={110} length={280} horizontal />
                <ConveyorLine left={200} top={110} length={0} />
                <ConveyorLine left={310} top={0} length={0} />
                <Separator left={30} top={10} />

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
              {t('overview.checklist')}
            </h1>
          </Row>
          <Row>
            <div>
              {[[0, 0], [1, 1], [0, 1], [1, 0]].map(([iConv, iPallet]) =>
                <h2 key={iConv * 2 + iPallet}>
                  {
                    pallet_enabled[iPallet] &&
                      curent_order[iPallet] == iConv &&
                      conveyor_enabled[iConv] &&
                      curent_task[iConv] !== null &&
                      pallet_operating[iPallet] ?
                      '✅' : '⛔'
                  }
                  &ensp;{t('overview.line')} {iConv == 0 ? 'A' : 'B'} {t('overview.to')} {iPallet == 0 ? 'A' : 'B'} |&nbsp;
                  {
                    !pallet_enabled[iPallet] ? t('overview.pallet_is_off')
                      .replace('{i}', iPallet == 0 ? 'A' : 'B')
                      .replaceJSX('{off}', <Red>{t('pallet.off')}</Red>) :
                      curent_order[iPallet] != iConv ? t('overview.pallet_is_order')
                        .replace('{iPallet}', iPallet == 0 ? 'A' : 'B')
                        .replaceJSX('{order}', <Red>{t('pallet.order')} {iConv == 1 ? 'A' : 'B'}</Red>) :
                        !conveyor_enabled[iConv] ? t('overview.conv_is_off')
                          .replace('{i}', iConv == 0 ? 'A' : 'B')
                          .replaceJSX('{off}', <Red>{t('pallet.off')}</Red>) :
                          curent_task[iConv] === null ? t('overview.create_new_order')
                            .replaceJSX('{new_order}', <Red>{t('overview.new_order').replace('{i}', iConv == 0 ? 'A' : 'B')}</Red>) :
                            !pallet_operating[iPallet] ? t('overview.no_pallet')
                              .replaceJSX('{no_pallet}', <Red>{t('pallet.no_in_output')}</Red>) :
                              <Green>{t('overview.on')}</Green>
                  }
                </h2>
              )}
            </div>
          </Row>
          <Row>
          </Row>
        </OverviewContent>
        <OverviewContent>
          <Row>
            <h1 style={{ color: styles.colors.gray3, fontWeight: 600 }}>
              {t('maincomponent.overviewview.current_task')}
            </h1>
          </Row>
          <TaskStat line_index={0} />
          <TaskStat line_index={1} />
          <OverViewDivider />
          <Button
            disabled={
              (latestStatus?.currentOrder?.[0] === 0 && (latestStatus?.finishLayerIdx?.[0] !== 0 || latestStatus?.finishBoxIdx?.[0] !== 0)) ||
              (latestStatus?.currentOrder?.[1] === 0 && (latestStatus?.finishLayerIdx?.[1] !== 0 || latestStatus?.finishBoxIdx?.[1] !== 0)) ||
              loadingStates.createTask
            }
            frontIcon={<IoIosCreate />}
            label={loadingStates.createTask ? 
              t('component.common.loading.text') + '...' : 
              t('maincomponent.createtask.button') + " A"}
            onTap={() => onCreateTask(0)}
          />
          <Button
            disabled={
              (latestStatus?.currentOrder?.[0] === 1 && (latestStatus?.finishLayerIdx?.[0] !== 0 || latestStatus?.finishBoxIdx?.[0] !== 0)) ||
              (latestStatus?.currentOrder?.[1] === 1 && (latestStatus?.finishLayerIdx?.[1] !== 0 || latestStatus?.finishBoxIdx?.[1] !== 0)) ||
              loadingStates.createTask
            }
            frontIcon={<IoIosCreate />}
            label={loadingStates.createTask ? 
              t('component.common.loading.text') + '...' : 
              t('maincomponent.createtask.button') + " B"}
            onTap={() => onCreateTask(1)}
          />
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