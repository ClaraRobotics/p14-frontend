import api from '@/api';
import { statusActions, statusState, taskState } from '@/store';
import styles from '@/styles/styles';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Button from '../common/buttons/Button';
import { GrTable, GrVmMaintenance } from 'react-icons/gr';
import { ImCogs, ImDownload2, ImUpload2 } from 'react-icons/im';
import { IconContext } from 'react-icons';
import { GiHorizontalFlip } from 'react-icons/gi';
import { VscDebugStart } from 'react-icons/vsc';
import { AiFillHome } from 'react-icons/ai';
import AlertModal from '../common/AlertModal';

import empty_pallet_load from '@/assets/icons/empty_pallet_load.svg';
import { viewActions, viewState } from '@/store/view';
import ModalPalletNotEmpty from '../common/modals/ModalPalletNotEmpty';

const ManualControlButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width:600px;
`;
const ButtonColumn = styled.div`
  flex: 50%;
  display: flex;
  flex-direction: row;
`;
const ButtonsGroup = styled.div`
  border: 4px solid ${styles.colors.gray5};
  padding: 15px;
  position: relative;
  margin: 10px;
  margin-top: 30px;
`;
const ButtonsGroupLabel = styled.div`
  position: absolute;
  top: -25px;
  height: 40px;
  line-height: 40px;
  left: 5px;
  font-size: 20pt;
  padding-left: 15px;
  padding-right: 15px;
  background-color: ${styles.colors.background1};
`;

const ManualControlButtons = ({ t }: WithTranslation) => {
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const latestStatus = status.lastHeartBeatMessage;

  const [loadingStates, setLoadingStates] = useState({
    loadPalletAndStart: false,
    gripperReleaseA: false,
    gripperReleaseB: false,
    goHome: false,
    goMaintenance: false,
    pickPallet1: false,
    pickPallet2: false
  });

  const handleApiCall = async (
    apiCall: () => Promise<any>,
    loadingKey: string,
    successMessage: string = 'สำเร็จ'
  ) => {
    try {
      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: true
      }));

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 10000);
      });

      await Promise.race([apiCall(), timeoutPromise]);

      console.log(successMessage);

      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: false
      }));

    } catch (error) {
      console.error('API call failed:', error);
      alert(error.message === 'Request timeout' ? 'คำขอหมดเวลา กรุณาลองใหม่อีกครั้ง' : 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      
      setLoadingStates(prev => ({
        ...prev,
        [loadingKey]: false
      }));
    }
  };

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };

  const loadPalletAndStart = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'RUN_STACK' }),
      'loadPalletAndStart',
      'เริ่มงาน RUN_STACK สำเร็จ'
    );
  };

  const gripperReleaseA = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'BTN_GRIPPER_R_A' }),
      'gripperReleaseA',
      'ปล่อย Gripper A สำเร็จ'
    );
  };

  const gripperReleaseB = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'BTN_GRIPPER_R_B' }),
      'gripperReleaseB',
      'ปล่อย Gripper B สำเร็จ'
    );
  };

  const goHome = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'BTN_GO_HOME' }),
      'goHome',
      'กลับตำแหน่ง Home สำเร็จ'
    );
  };

  const goMaintenance = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'BTN_GO_MAINTENANCE' }),
      'goMaintenance',
      'ไปตำแหน่ง Maintenance สำเร็จ'
    );
  };

  const pickPallet1 = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'PICK_PALLET_1' }),
      'pickPallet1',
      'หยิบ Pallet 1 สำเร็จ'
    );
  };

  const pickPallet2 = () => {
    handleApiCall(
      () => api.post('/robot/play-job', { job: 'PICK_PALLET_2' }),
      'pickPallet2',
      'หยิบ Pallet 2 สำเร็จ'
    );
  };

  // console.log({latestStatus})

  return (
    <ManualControlButtonsContainer>
      {/* <ButtonsGroup>
        <ButtonsGroupLabel>
          <IconContext.Provider
            value={{
              style: {
                width: '30px',
                height: '30px',
              },
            }}
          >
            <GrStackOverflow />
          </IconContext.Provider>{' '}
          Task start and stop
        </ButtonsGroupLabel>
        <ButtonColumn>
          <Button
            disabled={
              false
              // latestStatus.finishBoxIdx?.some(x => x!=0) ||
              // latestStatus.finishLayerIdx?.some(x => x!=0)
            }
            label={t('manualbuttons.load_and_start')}
            onTap={() =>
              // checkEmerThenCallAction(() =>
              //   viewActions.checkEmptyPalletThenCall(
              //     view,
              //     setView,
              //     status,
                  loadPalletAndStart()
              //   )
              // )
            }
            frontIcon={
              <>
                <VscDebugStart />
              </>
            }
          />
          <Button
            label={t('manualbuttons.end_order')}
            onTap={() => checkEmerThenCallAction(endStack)}
            // frontIcon={<ImUpload2 />}
          />
          { <Button
            label={t('manualbuttons.manual_load_pallet')}
            onTap={() => checkEmerThenCallAction(loadPallet)}
            frontIcon={<ImDownload2 />}
          />}
        </ButtonColumn>
      </ButtonsGroup> */}
      <ButtonsGroup>
        <ButtonsGroupLabel>
          <IconContext.Provider
            value={{
              style: {
                width: '30px',
                height: '30px',
              },
            }}
          >
            <ImCogs />
          </IconContext.Provider>{' '}
          {t('robotcommand.title')}
        </ButtonsGroupLabel>
        <ButtonColumn>
          <Button
            label={loadingStates.goHome ? t('component.common.loading.text') + '...' : t('manualbuttons.move_to_home')}
            onTap={() => checkEmerThenCallAction(goHome)}
            frontIcon={<AiFillHome />}
            doubleLine
            disabled={loadingStates.goHome}
          />
          <Button
            label={loadingStates.goMaintenance ? t('component.common.loading.text') + '...' : t('manualbuttons.move_to_maintenance')}
            onTap={() => checkEmerThenCallAction(goMaintenance)}
            frontIcon={<GrVmMaintenance />}
            doubleLine
            disabled={loadingStates.goMaintenance}
          />
        </ButtonColumn>
        <ButtonColumn>
          <Button
            // style={{ width: 130 }}
            label={loadingStates.gripperReleaseA ? t('component.common.loading.text') + '...' : t('manualbuttons.gripper_release_a')}
            onTap={() => checkEmerThenCallAction(gripperReleaseA)}
            // frontIcon={<GiHorizontalFlip />}
            doubleLine
            disabled={loadingStates.gripperReleaseA}
          />
          <Button
            // style={{ width: 130 }}
            label={loadingStates.gripperReleaseB ? t('component.common.loading.text') + '...' : t('manualbuttons.gripper_release_b')}
            onTap={() => checkEmerThenCallAction(gripperReleaseB)}
            // frontIcon={<GiHorizontalFlip />}
            doubleLine
            disabled={loadingStates.gripperReleaseB}
          />
          {/* <Button
            style={{ width: 130, fontSize: '1.4rem' }}
            disabled={palletExists}
            label={t("maincomponent.overviewview.pick_pallet") + " A"}
            onTap={() => checkEmerThenCallAction(pickPallet1)}
            // frontIcon={<GrTable />}
            doubleLine
          />
          <Button
            style={{ width: 130, fontSize: '1.4rem' }}
            disabled={palletExists}
            label={t("maincomponent.overviewview.pick_pallet") + " B"}
            onTap={() => checkEmerThenCallAction(pickPallet2)}
            // frontIcon={<GrTable />}
            doubleLine
          /> */}
        </ButtonColumn>
      </ButtonsGroup>
    </ManualControlButtonsContainer>
  );
};
export default withTranslation()(ManualControlButtons);