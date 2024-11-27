import { SetterOrUpdater } from 'recoil';
import { cloneDeep, toInteger } from 'lodash';

import { defaultStatus } from './state';
import { State } from './types';

export const updateConnectionStatus = (
	state: State,
	setter: SetterOrUpdater<State>,
	payload: ReadyState /*websocket connection status*/
) => {
	const connectionStatus = payload;
	setter({ ...state, connectionStatus: connectionStatus });
};

export const updateHeartBeatMessage = (
	state: State,
	setter: SetterOrUpdater<State>,
	payload: Object /*websocket connection status*/
) => {
	setter({ ...state, lastHeartBeatMessage: payload });
};

export const setCurrentTask = (
	state: State,
	setter: SetterOrUpdater<State>,
	payload: any /*robotSimulation object*/
) => {
	let newCurrentTask = state.currentTask;
	newCurrentTask[payload.line_index] = payload
	setter({ ...state, currentTask:newCurrentTask });
};
export const setCurrentTaskAndLoading = (
	state: State,
	setter: SetterOrUpdater<State>,
	payloadTask: any /*robotSimulation object*/,
	payloadLoading: boolean,
    title: string,
	line_index: number
) => {
	let currentTask = [
		...state.currentTask.slice(0, line_index),
		payloadTask,
		...state.currentTask.slice(line_index + 1)
	]

	let taskTitle = [
		...state.taskTitle.slice(0, line_index),
		title,
		...state.taskTitle.slice(line_index + 1)
	]

	setter({ ...state, currentTask, writeJobLoading: payloadLoading, taskTitle });
};

export const setWriteJobLoading = (
	state: State,
	setter: SetterOrUpdater<State>,
	payload: boolean /*true or false*/
) => {
	setter({ ...state, writeJobLoading: payload });
};
