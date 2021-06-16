import { useState, useEffect, useRef } from 'react';

import Model from './ecosphere/Model';
import { IModel } from "./ecosphere/Model/IModel";
import { LastDelta } from './ModelPresenter';

export type ModelAPI = {
  step: Function,
  lastChanges: LastDelta,
    // [groupName: string]: { [elementName: string]: number }
    // resources: { [elementName: string]: number }
    // animals: { [elementName: string]: number }
  // },
  setDelay: (milliseconds: number) => void
}

// ticks per sec
const ticksPerSecond = (n: number) => n > 0 ? Math.floor(1000 / n) : 1
const speeds = {slow: 10, fast: 25, faster: 50, fastest: 80};
export function useModel(model: IModel = new Model('Hello World')): ModelAPI {
  const [lastChanges, setLastChanges] = useState({} as LastDelta)
  const [delay, setDelay] = useState(ticksPerSecond(speeds.slow));
  const [shouldStep, step] = useState(false);
  const performStep = () => { step(true); };

  useEffect(() => {
    if (shouldStep) {
      let { changed } = model.step();
      step(false);
      setLastChanges(changed);
    }
  }, [shouldStep, model]);

  useInterval(() => step(true), delay); 

  return {
    step: performStep,
    lastChanges: lastChanges as LastDelta,
    setDelay,
  };
}

function useInterval(callback: any, delay: number) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      // @ts-ignore
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
