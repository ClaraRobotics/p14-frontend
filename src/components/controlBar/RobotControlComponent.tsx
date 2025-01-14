import styles from '@/styles/styles';
import React, { useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import api from '@/api';

import { AiFillControl } from 'react-icons/ai';
import { Popover } from 'react-tiny-popover';
import styled from 'styled-components';
import AlertModal from '../common/AlertModal';
import Button from '../common/buttons/Button';
import ControlButton from '../common/buttons/ControlButton';
import Toggle from '../common/Toggle';
import ExitKioskMode from './ExitKioskMode';

const RobotControlPopoverContainer = styled.div`
  background-color: ${styles.colors.gray7};
  display: flex;
  flex-direction: column;
  -webkit-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  -moz-box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  box-shadow: 0px 0px 18px 0px rgba(31, 31, 31, 0.5);
  width: 400px;
  z-index: 2;
  padding: 100px;
  padding-top: 100px;
  padding-bottom: 200px;
`;
const RobotControlComponent = ({ t }: WithTranslation) => {
  const [open, setOpen] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);

  return (
    <div>
      <Popover
        isOpen={open}
        onClickOutside={() => setOpen(false)}
        positions={['top']}
        align="end"
        padding={8}
        containerStyle={{ zIndex: '1' }}
        content={
          <RobotControlPopoverContainer>
            <Button
              label="Dev"
              onTap={() => {
                setShowControlPanel(true);
                //  window.electron.ipcRenderer.exitFullScreen();
              }}
            />
            <Button
              label="LightCT Deactivate"
              onTap={() => {
                api
                  .post('/robot/light-ct-inact-toggle', {isInact: true})
                  .then((res: any) => {});
              }}
            />
            <Button
              label="LightCT Activate"
              onTap={() => {
                api
                  .post('/robot/light-ct-inact-toggle', {isInact: false})
                  .then((res: any) => {});
              }}
            />
            <Button
              label="Pallet Release"
              onTap={() => {
                api
                  .post('/robot/play-job', { job: 'BTN_PALLET_RELEASE' })
                  .then((res: any) => {})
                  .catch((err: any) => {
                    alert(err);
                  });
              }}
            />
          </RobotControlPopoverContainer>
        }
      >
        <div onTouchEnd={() => setOpen(!open)}>
          <ControlButton
            icon={<AiFillControl />}
            label={t('controlbar.button.robotcontrol')}
          />
        </div>
      </Popover>
      <AlertModal
        title={''}
        show={showControlPanel}
        actionButtonLabel={t('common.ok')}
        onActionButtonTap={() => setShowControlPanel(false)}
      >
        <ExitKioskMode />
      </AlertModal>
    </div>
  );
};
export default withTranslation()(RobotControlComponent);
