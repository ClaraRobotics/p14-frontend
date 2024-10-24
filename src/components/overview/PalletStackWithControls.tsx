import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { NaNDisplay } from '@/util/numberDisplayUtils';
import { useRecoilState } from 'recoil';
import { MdEject } from 'react-icons/md';
import { IoIosRemove, IoIosAdd } from 'react-icons/io';
import styled from 'styled-components';
import styles from '@/styles/styles';

import Button from '@/components/common/buttons/Button';
import PalletStack from './PalletStack';
import api from '@/api';
import { statusState, statusActions } from '@/store';
import { viewActions, viewState } from '@/store/view';
import Toggle from '../common/Toggle';
import NumberDisplay from '../text/NumberDisplay';
import Column from '../common/Column';
import VerticalPercentBar from '../PercentBar/VerticalPercentBar';
import Row from '../common/Row';

interface PalletStackWithControlsContentProps {
  enabled: boolean;
}
const PalletStackWithControlsContainer = styled.div`
  position: relative;
  width: 640px;
  display: flex;
  flex-direction: row;
  margin-bottom: 60px;
  justify-content: flex-start;
`;

const PalletStackWithControlsContent = styled.div<PalletStackWithControlsContentProps>`
  paddding-top: 0px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const PalletStackWrap = styled.div`
  width: 250px;
`;
const PalletStackEjectWrap = styled.div``;
const PalletInfoContainer = styled.div`
  width: 500px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;
const PalletControlContainer = styled.div`
  position: absolute;
  top:  300px;
  left: 198px;
  z-index: 1;
`;

const idxToChr = (idx: number): string => {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
};

const onEjectLoadTap = (palletWaitLoad, idx) => {
  console.log(palletWaitLoad);
  console.log(idx);
  console.log(idxToChr(idx));
  if(palletWaitLoad){
    api
      .post('/robot/load-pallet', { palletId: idx })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  }
  else{
    api
      .post('/robot/eject-pallet', { palletId: idx })
      .then((res: any) => {})
      .catch((err: any) => {
        alert(err);
      });
  }
};

interface PalletStackWithControlsProps extends WithTranslation {
  idx: number;
}
const PalletStackWithControls = (propsData: PalletStackWithControlsProps) => {
  const { t, idx } = propsData;
  const [status, setStatus] = useRecoilState(statusState);
  const [view, setView] = useRecoilState(viewState);

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };

  const latestStatus = status.lastHeartBeatMessage;

  //TODO read ejected from last heatbeat message
  let palletEnabled      = latestStatus?.palletEnabled?.[idx] === true;
  let palletExists       = latestStatus?.palletState?.[idx]?.mn == 1;
  let palletWaitLoad     = latestStatus?.palletState?.[idx]?.mn == 6;
  let palletOperating    = latestStatus?.palletOperating?.[idx] === true;
  let bufferOutExists    = false;
  let layerHeightDiff    = latestStatus?.layerHeightDiff?.[idx];
  let finishBoxIdxSafe   = latestStatus?.finishBoxIdx?.[idx] == 0;
  let finishLayerIdxSafe = latestStatus?.finishLayerIdx?.[idx] == 0;
  let adjustEnabled      = latestStatus?.status_code?.slice(0, 8) != 'writing_' && (
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'LINE_' ||
    latestStatus?.running_job?.job_name?.slice(0, 9) == 'RUN_STACK' ||
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'PICK_'
  )

  return (
    <PalletStackWithControlsContainer>
      <PalletStackWithControlsContent enabled={palletEnabled}>
        <PalletStackWrap>
          {palletExists !== true ? (
            <h1
              style={{
                position: 'absolute',
                top: -19,
                left: 0,
                zIndex: 1,
                backgroundColor: 'rgba(50, 50, 50, 0.5)',
                width: '250px',
                height: '300px',
                lineHeight: '300px',
                textAlign: 'center',
              }}
            >
              {t('pallet.no_in_output')}
            </h1>
          ) : (
            ''
          )}
          <PalletStack idx={idx} />
        </PalletStackWrap>
        <Button
          disabled={
            palletOperating ||
            (
              !palletWaitLoad &&
              (
                !finishBoxIdxSafe || !finishLayerIdxSafe
              )
            )
          }
          vertical
          style={{
            width: 60,
            height: 300,
            margin: 0,
            zIndex: 1
          }}
          onTap={() => {
            checkEmerThenCallAction(() => onEjectLoadTap(palletWaitLoad, idx));
          }}
          frontIcon={
            <MdEject
              style={{ transform: palletWaitLoad ? 'rotate(90deg)' : 'rotate(-90deg)' }}
            />
          }
          label={palletWaitLoad ? t('common.load') : t('common.eject')}
        />
        <PalletControlContainer>
          {palletOperating ?
            <div style={{
              position: 'absolute',
              top: 7,
              left: -190,
              color: styles.colors.green,
              fontSize: '1.5em'
            }}>
              {t('pallet.operating')}...
            </div>
            : ''
          }
          <Toggle
            onLabel={t('common.on')}
            onValue={true}
            offLabel={t('common.off')}
            offValue={false}
            onToggle={(toggleValue: boolean) => {
              // alert("toggle");
              api
                .post('/robot/pallet-enable-toggle', {
                  // deprecated
                  palletId: idx, // 0, 1
                  isEnable: toggleValue,
                })
                .then((res: any) => {});
            }}
            selected={palletEnabled}
            hilighted
          />
        </PalletControlContainer>
      </PalletStackWithControlsContent>
      <PalletInfoContainer>

        <Row>
          <Column style={{ width: 310 }}>
            <Row>
              {' '}
              <Column style={{ width: 150 }}>
                <NumberDisplay
                  value={
                    status.currentTask?.isDoubleStack
                      ? `${latestStatus?.finishLayerIdx?.[idx] + 1}-${
                          latestStatus?.finishLayerIdx?.[idx] + 2
                        }`
                      : `${latestStatus?.finishLayerIdx?.[idx] + 1}`
                  }
                  label={t('taskbuilder.layer.title').toLocaleUpperCase()}
                />
              </Column>
              <Column style={{ width: 150 }}>
                <NumberDisplay
                  value={
                    status.currentTask?.isDoubleStack
                      ? `${latestStatus?.finishBoxIdx?.[idx] * 2 + 1}-${
                          latestStatus?.finishBoxIdx?.[idx] * 2 + 2
                        }`
                      : `${latestStatus?.finishBoxIdx?.[idx] + 1}`
                  }
                  label={t('common.box').toLocaleUpperCase()}
                />
              </Column>
            </Row>
            <Row>
              <Column style={{ width: 150 }}>
                <VerticalPercentBar
                  label={t('overview.current_stack')}
                  percent={
                    (latestStatus.finishLayerIdx?.[idx] *
                      status.currentTask?.baseBoxes?.length +
                      latestStatus.finishBoxIdx?.[idx] *
                        (status.currentTask?.isDoubleStack ? 2 : 1)) /
                      status?.currentTask?.boxAmount ?? Number.MAX_SAFE_INTEGER
                  }
                >
                  {NaNDisplay(
                    latestStatus.finishLayerIdx?.[idx] *
                      status.currentTask?.baseBoxes?.length +
                      latestStatus.finishBoxIdx?.[idx] *
                        (status.currentTask?.isDoubleStack ? 2 : 1)
                  )}
                  <br />/{NaNDisplay(status?.currentTask?.boxAmount)}
                </VerticalPercentBar>
              </Column>
              <Column style={{ paddingTop: 10 }}>
                <Row>
                  <NumberDisplay
                      value={bufferOutExists ? t('common.full') : t('common.empty')}
                      label={t('pallet.waiting_area')}
                    />
                </Row>
                <Row style={{height: 80}}>
                  <NumberDisplay
                      value={layerHeightDiff}
                      label={t('pallet.adjust_height')}
                      plus
                    />
                </Row>
                <Row>
                  <Button
                    style={{ width: 50, margin: 0 }}
                    disabled={!adjustEnabled}
                    frontIcon={<IoIosRemove />}
                    onTap={() => {
                      api
                        .post('/robot/adjust-dynamic-height', {
                          palletId: idx,
                          adjustMm: layerHeightDiff - 7
                        })
                        .then((res: any) => {});
                    }}
                  />
                  &ensp;
                  <Button
                    style={{ width: 50, margin: 0 }}
                    disabled={!adjustEnabled}
                    frontIcon={<IoIosAdd />}
                    onTap={() => {
                      api
                        .post('/robot/adjust-dynamic-height', {
                          palletId: idx,
                          adjustMm: layerHeightDiff + 7
                        })
                        .then((res: any) => {});
                    }}
                  />
                </Row>
              </Column>
              {/* <NumberDisplay
              value={
                NaNDisplay(
                  latestStatus.finishLayerIdx?.[idx] *
                    status.currentTask?.baseBoxes?.length +
                    latestStatus.finishBoxIdx?.[idx]
                ) +
                ' / ' +
                NaNDisplay(status?.currentTask?.boxAmount)
              }
              label={t('common.total').toLocaleUpperCase()}
            /> */}
            </Row>
          </Column>
        </Row>
      </PalletInfoContainer>
    </PalletStackWithControlsContainer>
  );
};

export default withTranslation()(PalletStackWithControls);
