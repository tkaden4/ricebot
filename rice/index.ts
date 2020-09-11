export enum CookerState {
  OFF,
  IDLE,
  COOKING,
}

export function prettifyState(state: CookerState) {
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

export enum StateChange {
  STARTED,
  DONE,
  STOPPED,
}

export function toStateChange(
  previous: CookerState,
  current: CookerState
): StateChange {
  if (previous === CookerState.OFF && current === CookerState.COOKING)
    return StateChange.STARTED;
  else if (previous === CookerState.COOKING && current === CookerState.IDLE)
    return StateChange.DONE;
  else if (previous !== CookerState.OFF && current === CookerState.OFF)
    return StateChange.STOPPED;
  else
    throw new Error(
      `Unrecognized state change ${prettifyState(previous)} -> ${prettifyState(
        current
      )}`
    );
}

export interface Filter {
  filter(current: number): number;
}

export class ExponentialFilter implements Filter {
  private previous: number;
  private weight: number;

  constructor(weight: number, initialValue: number = 0) {
    this.weight = weight;
    this.previous = initialValue;
  }

  filter(current: number): number {
    const filteredValue = ExponentialFilter.filter(
      this.weight,
      this.previous,
      current
    );
    this.previous = filteredValue;
    return filteredValue;
  }

  static filter(weight: number, previous: number, current: number) {
    return weight * previous + (1 - weight) * current;
  }
}

export interface Classifier {
  classify(current: number): CookerState;
}

export class PowerLevelClassifier implements Classifier {
  private idle: number;
  private cooking: number;

  constructor(idle: number, cooking: number) {
    this.idle = idle;
    this.cooking = cooking;
  }

  classify(current: number): CookerState {
    return current < this.idle
      ? CookerState.OFF
      : current < this.cooking
      ? CookerState.IDLE
      : CookerState.COOKING;
  }
}

export class FilteredClassifier implements Classifier {
  private filter: Filter;
  private classifier: Classifier;

  constructor(filter: Filter, classifier: Classifier) {
    this.filter = filter;
    this.classifier = classifier;
  }

  classify(current: number): CookerState {
    return this.classifier.classify(this.filter.filter(current));
  }
}
