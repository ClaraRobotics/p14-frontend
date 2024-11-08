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

  let palletExists         = latestStatus?.palletState?.[0]?.a

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };
  const loadPalletAndStart = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'RUN_STACK' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const gripperReleaseA = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'GP_SOLN_GRIPPER_R_A' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const gripperReleaseB = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'GP_SOLN_GRIPPER_R_B' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const loadPallet = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'PALLET_LOAD' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };

  const goHome = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'GO_HOME' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const goMaintenance = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'GO_MAINTENANCE' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const pickPallet1 = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'PICK_PALLET_1' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const pickPallet2 = () => {
    //TODO handle error
    api
      .post('/robot/play-job', { job: 'PICK_PALLET_2' })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
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
          คำสั่งหุ่นยนต์
        </ButtonsGroupLabel>
        <ButtonColumn>
          <Button
            style={{ width: 130 }}
            label={t('manualbuttons.gripper_release_a')}
            onTap={() => checkEmerThenCallAction(gripperReleaseA)}
            // frontIcon={<GiHorizontalFlip />}
            doubleLine
          />
          <Button
            style={{ width: 130 }}
            label={t('manualbuttons.gripper_release_b')}
            onTap={() => checkEmerThenCallAction(gripperReleaseB)}
            // frontIcon={<GiHorizontalFlip />}
            doubleLine
          />
          <Button
            label={t('manualbuttons.move_to_home')}
            onTap={() => checkEmerThenCallAction(goHome)}
            frontIcon={<AiFillHome />}
            doubleLine
          />
        </ButtonColumn>
        <ButtonColumn>
          <Button
            style={{ width: 130 }}
            disabled={palletExists}
            label={t("maincomponent.overviewview.pick_pallet") + " A"}
            onTap={() => checkEmerThenCallAction(pickPallet1)}
            // frontIcon={<GrTable />}
            doubleLine
          />
          <Button
            style={{ width: 130 }}
            disabled={palletExists}
            label={t("maincomponent.overviewview.pick_pallet") + " B"}
            onTap={() => checkEmerThenCallAction(pickPallet2)}
            // frontIcon={<GrTable />}
            doubleLine
          />
          <Button
            label={t('manualbuttons.move_to_maintenance')}
            onTap={() => checkEmerThenCallAction(goMaintenance)}
            frontIcon={<GrVmMaintenance />}
            doubleLine
          />
        </ButtonColumn>
      </ButtonsGroup>
    </ManualControlButtonsContainer>
  );
};
export default withTranslation()(ManualControlButtons);
