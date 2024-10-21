import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { statusState, statusActions } from '@/store';
import { useRecoilState } from 'recoil';

import ModalReleaseEmer from '@/components/common/modals/ModalReleaseEmer';
import { viewState, viewActions } from '@/store';
import ModalIntrusionDetected from '@/components/common/modals/ModalIntrusionDetected';
import ModalPalletNotEmpty from '@/components/common/modals/ModalPalletNotEmpty';
import api from '@/api';
import Toast from '@/components/statusdisplay/Toast';
import ModalRefillLightCurtainConfirm from '@/components/common/modals/ModalRefillLightCurtainConfirm';
import ModalLowPallet from '@/components/common/modals/ModalLowPallet';
import ModalLowSlipsheet from '@/components/common/modals/ModalLowSlipsheet';
import ModalAlarm from '@/components/common/modals/ModalAlarm';

const ModalsComponents = ({ t }: WithTranslation) => {
  const [view, setView] = useRecoilState(viewState);
  const [status, setStatus] = useRecoilState(statusState);
  const [clock01, setClock01] = useState(false);
  const [clock02, setClock02] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => setClock01(!clock01), 1500);

    return () => clearInterval(interval);
  }, [clock01]);

  useEffect(() => {
    const interval = setInterval(() => setClock02(!clock02), 1500);

    return () => clearInterval(interval);
  }, [clock02]);


  useEffect(() => {
    if (clock01) return

    if (status.lastHeartBeatMessage?.alarm?.all === true) {
      viewActions.setAlarmModal(view, setView, true);
    }

    if (status.lastHeartBeatMessage?.alarm?.all === false) {
      viewActions.setAlarmModal(view, setView, false)
    }
  }, [clock01]);

  useEffect(() => {
    if (clock02) return

    if (status.lastHeartBeatMessage?.lightCtSafe === false) {
      viewActions.setIntrustionDetectedModal(view, setView, true)
    }
    if (status.lastHeartBeatMessage?.lightCtSafe === true) {
      viewActions.setIntrustionDetectedModal(view, setView, false)
    }
  }, [clock02]);


  const endStack = () => {
    api
      .get('/robot/end-order')
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
    //TODO handle error
    // statusActions.setCurrentTask(status, setStatus, {});
  };
  const resetLightCurtainEmergency = () => {
    api
      .get('/robot/reset-light-curtain')
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  const resetAlarm = () => {
    api
      .get('/robot/reset-alarm')
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  };
  return (
    <>
      {view.showToast && <Toast></Toast>}
      <ModalReleaseEmer
        isShow={view.showReleaseEmerModal}
        callbackAction={() =>
          viewActions.setReleaseEmerModal(view, setView, false)
        }
      />
      <ModalAlarm
        callbackAction={() => {
          resetAlarm();
          setClock01(false)
          setTimeout(
            () => viewActions.setAlarmModal(view, setView, false),
            1
          );
        }}
        callbackSubButton={() =>
          viewActions.setAlarmModal(view, setView, false)
        }
      />
      {/* <ModalIntrusionDetected
        callbackAction={() => {
          resetLightCurtainEmergency();
          setClock02(false)
          setTimeout(
            () => viewActions.setIntrustionDetectedModal(view, setView, false),
            1
          );
        }}
      /> */}
      <ModalPalletNotEmpty
        callbackAction={() => {
          // endStack();
          viewActions.setPalletNotEmptyModal(view, setView, false);
        }}
        callbackSubButton={() =>
          viewActions.setPalletNotEmptyModal(view, setView, false)
        }
      />
      <ModalLowPallet
        callbackAction={() => {

        }}
        callbackSubButton={() =>{

        }}
      />
      <ModalLowSlipsheet
        callbackAction={() => {

        }}
        callbackSubButton={() =>{
        }}
      />
      {/* <ModalRefillLightCurtainConfirm /> */}
    </>
  );
};
export default withTranslation()(ModalsComponents);
