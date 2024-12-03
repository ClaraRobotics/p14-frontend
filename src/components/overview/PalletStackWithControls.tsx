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
import TriToggle from '@/components/common/TriToggle';
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
  left: 80px;
  z-index: 1;
`;
const TextWatermark = styled.h1`
    position: absolute;
    top: -19px;
    left:  0px;
    z-index:  1;
    background-color: rgba(50, 50, 50, 0.5);
    width:  250px;
    height: 300px;
    line-height: 300px;
    text-align: center;
`

const idxToChr = (idx: number): string => {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
};

const onEjectLoadTap = (idx) => {
  api
    .post('/robot/eject-pallet', { palletId: idx })
    .then((res: any) => {})
    .catch((err: any) => {
      alert(err);
    });
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

  const current_order    = latestStatus?.currentOrder?.[idx];
  let palletEnabled      = latestStatus?.palletEnabled?.[idx] === true;
  let palletOperating    = latestStatus?.palletOperating?.[idx] === true;
  let layerHeightDiff    = latestStatus?.layerHeightDiff?.[idx];
  let adjustEnabled      = latestStatus?.status_code?.slice(0, 6) != 'order_' && (
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'LINE_' ||
    latestStatus?.running_job?.job_name?.slice(0, 4) == 'RUN_'  ||
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'PICK_'
  )

  return (
    <PalletStackWithControlsContainer>
      <h1 style={{position: 'absolute', left: 0, top: -33, color: styles.colors.gray1, zIndex: 10}}>Pallet {idx==0 ? 'A' : 'B'}</h1>
      <PalletStackWithControlsContent enabled={palletEnabled}>
        <PalletStackWrap>
          {
            palletOperating ?
              <PalletStack idx={idx} />
            :
              <TextWatermark>{t('pallet.no_in_output')}</TextWatermark>
          }
        </PalletStackWrap>
        <Button
          disabled={false}
          style={{
            width: 60,
            height: 300,
            margin: 0,
            zIndex: 1
          }}
          onTap={() => {
            checkEmerThenCallAction(() => onEjectLoadTap(idx));
          }}
          frontIcon={
            <MdEject
              style={{ transform: 'rotate(-90deg)' }}
            />
          }
          label={t('common.eject')}
          vertical
        />
        <PalletControlContainer>
          <TriToggle
            label_0={'OFF'}
            label_1={'Order A'}
            label_2={'Order B'}
            value_0={99}
            value_1={0}
            value_2={1}
            selected={
              !palletEnabled ? 99 : 
              latestStatus.nextOrder?.[idx] == 0 ? 0 :
              latestStatus.nextOrder?.[idx] == 1 ? 1 :
              99
            }
            onToggle={(value) => {
              api
                .post('/robot/pallet-enable-toggle', {
                  palletId: idx,        // 0, 1
                  isEnable: value != 99,
                  nextOrder: value
                })
                .then((res: any) => {});
            }}
            hilighted
          />
          {/* <Toggle
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
          /> */}
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
                    status.currentTask[current_order]?.isDoubleStack
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
                    status.currentTask[current_order]?.isDoubleStack
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
                      status.currentTask[current_order]?.baseBoxes?.length +
                      latestStatus.finishBoxIdx?.[idx] *
                        (status.currentTask[current_order]?.isDoubleStack ? 2 : 1)) /
                      status?.currentTask[current_order]?.boxAmount ?? Number.MAX_SAFE_INTEGER
                  }
                >
                  {NaNDisplay(
                    latestStatus.finishLayerIdx?.[idx] *
                      status.currentTask[current_order]?.baseBoxes?.length +
                      latestStatus.finishBoxIdx?.[idx] *
                        (status.currentTask[current_order]?.isDoubleStack ? 2 : 1)
                  )}
                  <br />/{NaNDisplay(status?.currentTask[current_order]?.boxAmount)}
                </VerticalPercentBar>
              </Column>
              <Column style={{ paddingTop: 10 }}>
                <Row>
                  <NumberDisplay
                      value={
                        latestStatus.currentOrder?.[idx] == 0 ? 'Order A' : 
                        latestStatus.currentOrder?.[idx] == 1 ? 'Order B' :
                                                                'No Order'
                      }
                      label={t('pallet.pallet_order')}
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
                          adjustMm: layerHeightDiff - 10
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
                          adjustMm: layerHeightDiff + 10
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
