import { useState, useEffect, useRef } from 'react';

import Model from './ecosphere/Model';

type ModelAPI = {
  step: Function,
  lastInventoryChanges: { [elementName: string]: number },
  setDelay: (milliseconds: number) => void
}

// ticks per sec
const ticksPerSecond = (n: number) => n > 0 ? Math.floor(1000 / n) : 1
const speeds = {slow: 10, fast: 25, faster: 50, fastest: 80};
export function useModel(model: Model = new Model('Hello World')): ModelAPI {
  const [lastChanges, setLastChanges] = useState({})
  const [delay, setDelay] = useState(ticksPerSecond(speeds.slow));
  const [shouldStep, step] = useState(false);
  const performStep = () => { step(true); };

  useEffect(() => {
    if (shouldStep) {
      let deltas = model.step();
      step(false);
      setLastChanges(deltas.changed);
    }
  }, [shouldStep, model]);

  useInterval(() => step(true), delay); 
  // useInterval(performStep, delay); 

  return {
    step: performStep,
    lastInventoryChanges: lastChanges,
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
