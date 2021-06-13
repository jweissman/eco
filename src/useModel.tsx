import { useState, useEffect, useRef } from 'react';

import Model from './ecosphere/Model';

type ModelAPI = {
  step: Function,
  lastInventoryChanges: { [elementName: string]: number },
  setDelay: (milliseconds: number) => void
}

export function useModel(model: Model): ModelAPI {
  const [shouldStep, step] = useState(false);
  const [delay, setDelay] = useState(100);
  const [lastChanges, setLastChanges] = useState({})
  const performStep = () => { step(true); };

  useEffect(() => {
    if (shouldStep) {
      let deltas = model.step();
      step(false);
      setLastChanges(deltas.changed);
    }
  }, [shouldStep, model]);

  useInterval(() => step(true), delay); 

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
