import api from '@/api';
import { statusState } from '@/store';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Toggle from '../common/Toggle';
import conveyor from '@/assets/icons/conveyor.svg';
import styles from '@/styles/styles';

const ConveyorContainer = styled.div`
  position:relative;
  padding-top:75px;
`;
interface ConveyorControlProps {
  left:number;
}
const ConveyorControl = styled.div<ConveyorControlProps>`
  position:absolute;
  top:120px;
  left:${props=>props.left}px;
  padding:10px;
  background-color:${styles.colors.gray5}

`;
interface ConveyorProps extends WithTranslation {
  idx: number;
}
const Conveyor = (propsData: ConveyorProps) => {
  const { t, idx } = propsData;
  const [status, setStatus] = useRecoilState(statusState);

  let enabled =
    status.lastHeartBeatMessage?.conveyor_enable_status?.[idx] === true;

  return (
    <ConveyorContainer>
      <img src={conveyor} width={400} />
      <ConveyorControl left={10}>
        <Toggle
          onLabel="ON"
          onValue={true}
          offLabel="OFF"
          offValue={false}
          onToggle={(toggleValue: boolean) => {
            // alert('toggle');
            api
              .post('/robot/conveyor-enable-toggle', { // deprecated
                conveyorId: idx, // 0, 1
                isEnable: toggleValue,
              })
              .then((res: any) => {});
          }}
          selected={enabled}
        />
      </ConveyorControl>
      <ConveyorControl left={200}>
        <Toggle
          onLabel="ON"
          onValue={true}
          offLabel="OFF"
          offValue={false}
          onToggle={(toggleValue: boolean) => {
            // alert('toggle');
            api
              .post('/robot/conveyor-enable-toggle', { // deprecated
                conveyorId: idx, // 0, 1
                isEnable: toggleValue,
              })
              .then((res: any) => {});
          }}
          selected={enabled}
        />
      </ConveyorControl>
    </ConveyorContainer>
  );
};

export default withTranslation()(Conveyor);
