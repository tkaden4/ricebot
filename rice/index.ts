export enum CookerState {
  OFF,
  IDLE,
  COOKING,
}

export function prettifyState(state: CookerState): string {
  switch (state) {
    case CookerState.OFF:
      return "OFF";
    case CookerState.IDLE:
      return "IDLE";
    case CookerState.COOKING:
      return "COOKING";
  }
}

export function parseState(s: string): CookerState {
  switch (s) {
    case "OFF":
      return CookerState.OFF;
    case "IDLE":
      return CookerState.IDLE;
    case "COOKING":
      return CookerState.COOKING;
    default:
      throw new Error(`Unknown cooker state ${s}`);
  }
}

export interface StateTransition {
  (state: CookerState): Array<[CookerState, number]>;
}

export const TRANSITION_THRESHOLD = 0.05;
