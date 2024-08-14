import React, { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { MemoryRouter as Router, Switch, Route, useLocation } from 'react-router-dom';

import { statusState, statusActions } from '@/store';

import styles from '@/styles/styles';
import OverviewView from '@/views/OverviewView';
import TaskBuilderView from '@/views/TaskBuilderView';
import ExistingTaskListView from '@/views/ExistingTaskListView';
import DevPage from '@/views/DevPage';
import ControlCenterContainer from '@/components/controlCenter/ControlCenterContainer';
import ControlCenterButton from '@/components/navBar/ControlCenterButton';
import NavBar from '@/components/navBar/NavBar';
import ControlBar from '@/components/controlBar';
import ModalsComponent from '@/renderer/ModalsComponent';
import DashboardView from '@/views/DashboardView';

const MainComponentContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${styles.colors.gray8};
  margin: 0px;
`;

const MainComponent = () => {
  const [socketUrl, setSocketUrl] = useState(
    process.env.ROBOT_ENV === 'production'
      ? 'ws://localhost:8085'
      : 'ws://localhost:8085'
  );
  //const [ socketUrl, setSocketUrl ] = useState('ws://palletizer-ws.mixipedia.org');
  const [messageHistory, setMessageHistory] = useState({});
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
  });
  useEffect(() => {
    if (lastMessage !== null) {
      // console.log('useEffect');
      let message_obj = JSON.parse(lastMessage.data);
      if (message_obj !== undefined) {
        setMessageHistory((prev) => message_obj);
        // console.log('status message heartbeat:', message_obj);
        statusActions.updateHeartBeatMessage(
          status,
          setStatus,
          message_obj
        );
      }
    }
  }, [lastMessage, setMessageHistory]);

  const [status, setStatus] = useRecoilState(statusState);
  useEffect(() => {
    statusActions.updateConnectionStatus(
      status,
      setStatus,
      readyState as ReadyState
    );
  }, [readyState, statusActions.updateConnectionStatus]);
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const location = useLocation();
  const isDevPage = location.pathname === '/dev-page';

  return (
    <MainComponentContainer>
      <ModalsComponent />
      <NavBar noMargin={isDevPage}/>
      {/* <ControlCenterContainer /> */}
      <Switch>
        <Route exact path="/" component={OverviewView} />
        <Route path="/pattern-builder" component={TaskBuilderView} />
        <Route path="/existing-task" component={ExistingTaskListView} />
        <Route path="/dashboard" component={DashboardView} />
        <Route path="/dev-page" component={DevPage} />
      </Switch>
      <ControlBar />
    </MainComponentContainer>
  );
};
export default withTranslation()(MainComponent);
