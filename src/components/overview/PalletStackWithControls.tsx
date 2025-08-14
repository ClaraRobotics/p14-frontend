import React, { useState } from 'react';
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
import TriToggle from '@/components/common/TriToggle';
import NumberDisplay from '../text/NumberDisplay';
import Column from '../common/Column';
import VerticalPercentBar from '../PercentBar/VerticalPercentBar';
import Row from '../common/Row';
import AlertModal from '../common/AlertModal';

interface PalletStackWithControlsContentProps {
  enabled: boolean;
}
const PalletStackWithControlsContainer = styled.div`
  margin-left: 20px;
  position: relative;
  width: 170px;
  display: flex;
  flex-direction: row;
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

const PalletInfoContainer = styled.div`
  width: 280px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;

const RegisterPanelContainer = styled.div`
  width: 400px;
  height: 200px;
  font-size: 0.7em;
`;

const RegValueContainer = styled.div`
  line-height:70px;
  font-size:30px;
  text-align:center;
  color:white;
  width:80px;
`;

const TextWatermark = styled.h1`
    position: absolute;
    top: 0px;
    left:  0px;
    z-index:  1;
    background-color: rgba(50, 50, 50, 0.5);
    width:  250px;
    height: 500px;
    line-height: 300px;
    text-align: center;
`;

const REGButton = styled(Button)`
  width: 150px;
  height: 30px;
  font-size: 18px;
`;

const idxToChr = (idx: number): string => {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
};

const onEjectLoadTap = (idx) => {
  api
    .post('/robot/eject-pallet', { palletId: idx })
    .then((res: any) => { })
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
  const [showRegAdjustModal, setShowRegAdjustModal] = useState(false);

  const checkEmerThenCallAction = (callbackFunction: () => any) => {
    viewActions.checkEmerThencall(view, setView, status, callbackFunction);
  };

  const latestStatus = status.lastHeartBeatMessage;

  const current_order = latestStatus?.currentOrder?.[idx];
  let palletEnabled = latestStatus?.palletEnabled?.[idx] === true;
  let palletOperating = latestStatus?.palletOperating?.[idx] === true;
  let layerHeightDiff = latestStatus?.layerHeightDiff?.[idx];
  let adjustEnabled = latestStatus?.status_code?.slice(0, 6) != 'order_' && (
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'LINE_' ||
    latestStatus?.running_job?.job_name?.slice(0, 4) == 'RUN_' ||
    latestStatus?.running_job?.job_name?.slice(0, 5) == 'PICK_'
  )

  let gripperCurrentValue = latestStatus?.gripperCurrentValue;

  const [gripperValueA, setGripperValueA] = useState(30);
  const [gripperValueB, setGripperValueB] = useState(30);

  const adjustGripper = (pallet: 'A' | 'B', delta: number) => {
    const setValue = pallet === 'A' ? setGripperValueA : setGripperValueB;
    const currentValue = pallet === 'A' ? gripperValueA : gripperValueB;

    const newValue = Math.max(0, Math.min(100, currentValue + delta));
    setValue(newValue);

    api.post('/robot/adjust-gripper', {
      pallet,
      value: newValue,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Column className="col-5">
        <Row>
          <h1
            style={{
              fontSize: 30,
              margin: 0,
              color: styles.colors.gray1
            }}
          >
            {t('pallet.pallet')} {idx === 0 ? 'A' : 'B'}
          </h1>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <REGButton
            label={'REG ADJ.'}
            onTap={() => {
              setShowRegAdjustModal(true);
            }}
            className="primary"
          />
        </Row>
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
              width: 55,
              height: 200,
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
        </PalletStackWithControlsContent>
        <TriToggle
            label_0={t('pallet.off')}
            label_1={t('pallet.order') + ' A'}
            label_2={t('pallet.order') + ' B'}
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
                .then((res: any) => { });
            }}
            hilighted
          />
      </Column>

      <Column>
        <PalletInfoContainer>
          <Row>
            <Column style={{ width: 300 }}>
              <Row>
                <Column style={{ width: 150 }}>
                  <NumberDisplay
                    value={
                      status.currentTask[current_order]?.isDoubleStack
                        ? `${latestStatus?.finishLayerIdx?.[idx] + 1}-${latestStatus?.finishLayerIdx?.[idx] + 2
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
                        ? `${latestStatus?.finishBoxIdx?.[idx] * 2 + 1}-${latestStatus?.finishBoxIdx?.[idx] * 2 + 2
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
                      (
                        (
                          latestStatus.finishLayerIdx?.[idx] *
                          (status.currentTask[current_order]?.baseBoxes?.length ?? 0) +
                          latestStatus.finishBoxIdx?.[idx] *
                          (status.currentTask[current_order]?.isDoubleStack ? 2 : 1)
                        ) /
                        (status?.currentTask[current_order]?.boxAmount ?? Number.MAX_SAFE_INTEGER)
                      )
                    }
                  >
                    {NaNDisplay(
                      latestStatus.finishLayerIdx?.[idx] *
                      (status.currentTask[current_order]?.baseBoxes?.length ?? 0) +
                      latestStatus.finishBoxIdx?.[idx] *
                      (status.currentTask[current_order]?.isDoubleStack ? 2 : 1)
                    )}
                    <br />/
                    {NaNDisplay(status?.currentTask[current_order]?.boxAmount)}
                  </VerticalPercentBar>

                </Column>
                <Column style={{ paddingTop: 10 }}>
                  <Row>
                    <NumberDisplay
                      value={
                        latestStatus.currentOrder?.[idx] == 0 ? t('pallet.order') + ' A' :
                          latestStatus.currentOrder?.[idx] == 1 ? t('pallet.order') + ' B' :
                            t('pallet.no_order')
                      }
                      label={t('pallet.pallet_order')}
                    />
                  </Row>
                  <Row style={{ height: 80 }}>
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
                          .then((res: any) => { });
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
                          .then((res: any) => { });
                      }}
                    />
                  </Row>
                </Column>
              </Row>
            </Column>
          </Row>
        </PalletInfoContainer>
      </Column>
      <PalletStackWithControlsContainer>

        <AlertModal
          title="ปรับค่า REGISTER"
          show={showRegAdjustModal}
          actionButtonLabel="ปิด"
          onActionButtonTap={() => setShowRegAdjustModal(false)}
          actionButtonType="danger"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '12px' }}>
            {/* Pallet A */}
            <RegisterPanelContainer>
              <Row style={{ marginBottom: '8px' }}>
                <div className="register-title" style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                  แรงบีบกริปเปอร์ (Pallet A)
                </div>
              </Row>
              <Row>
                <Column className="col-4">
                  <Button
                    style={{ width: '80px' }}
                    label="-10"
                    onTap={() => adjustGripper('A', -10)}
                    className="primary"
                  />
                </Column>
                <Column className="col-4">
                  <RegValueContainer>{`${gripperValueA}%`}</RegValueContainer>
                </Column>
                <Column className="col-4">
                  <Button
                    style={{ width: '80px' }}
                    label="+10"
                    onTap={() => adjustGripper('A', 10)}
                    className="primary"
                  />
                </Column>
              </Row>
            </RegisterPanelContainer>

            {/* Pallet B */}
            <RegisterPanelContainer>
              <Row style={{ marginBottom: '8px' }}>
                <div className="register-title" style={{ fontWeight: 'bold', textAlign: 'center', width: '100%' }}>
                  แรงบีบกริปเปอร์ (Pallet B)
                </div>
              </Row>
              <Row>
                <Column className="col-4">
                  <Button
                    style={{ width: '80px' }}
                    label="-10"
                    onTap={() => adjustGripper('B', -10)}
                    className="primary"
                  />
                </Column>
                <Column className="col-4">
                  <RegValueContainer>{`${gripperValueB}%`}</RegValueContainer>
                </Column>
                <Column className="col-4">
                  <Button
                    style={{ width: '80px' }}
                    label="+10"
                    onTap={() => adjustGripper('B', 10)}
                    className="primary"
                  />
                </Column>
              </Row>
            </RegisterPanelContainer>
          </div>
        </AlertModal>

      </PalletStackWithControlsContainer>
    </div>
  );
};

export default withTranslation()(PalletStackWithControls);