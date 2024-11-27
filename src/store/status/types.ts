import { HeartBeatMessage } from "@/types/status";
export interface State {
  connectionStatus:ReadyState;
  lastHeartBeatMessage:any;
  currentTask:any; //TODO robotSimulation type
  writeJobLoading:boolean;
  taskTitle: string[]
}
