import { useState, useEffect, useRef } from 'react';
import { IModel } from "./ecosphere/Model/IModel";
import { LastDelta } from './ModelPresenter';

export type ModelAPI = {
  model: IModel
  setModel(model: IModel): void
  step: Function,
  lastChanges: LastDelta,
  send: (actionName: string, args: any) => void,
  choose: (policyName: string, args: any) => void,
  setDelay: (milliseconds: number) => void
}

// ticks per sec
const ticksPerSecond = (n: number) => n > 0 ? Math.floor(1000 / n) : 1
const speeds = {slow: 10, fast: 25, faster: 50, fastest: 80};
export function useModel(initialModel: IModel): ModelAPI { //model: IModel = new Model('Hello World')): ModelAPI {
  const [model, setModel] = useState(initialModel) //new Model('Hello World'))

  const [lastChanges, setLastChanges] = useState({} as LastDelta)
  const [delay, setDelay] = useState(ticksPerSecond(speeds.slow));

  const [shouldStep, step] = useState(false);
  const [shouldSend, doSend] = useState(false);
  const [shouldManage, doManage] = useState(false)

  const performStep = () => { step(true); };
  const [command, setCommand] = useState('')
  const [policy, setPolicy] = useState('')

  useEffect(() => {
    if (shouldSend) {
      if (command) { model.send(command, {}) }
      doSend(false)
    }
  }, [command, model, shouldSend]);

  useEffect(() => {
    if (shouldManage) {
      if (command) { model.choose(policy, {}) }
      doManage(false)
    }
  }, [policy, model, shouldManage]);

  const performSend = (actionName: string, args: any) => {
    setCommand(actionName)
    doSend(true)
  }

  const performChoose = (policyName: string, args: any) => {
    // console.log("CHOOSE", policyName)
    setPolicy(policyName)
    doManage(true)
  }

  useEffect(() => {
    if (shouldStep) {
      let { changed } = model.step();
      step(false);
      setLastChanges(changed);
    }
  }, [shouldStep, model]);

  useInterval(() => step(true), delay); 

  return {
    model,
    step: performStep,
    lastChanges: lastChanges as LastDelta,
    send: (actionName: string, args: any) => performSend(actionName, args), 
    choose: (policyName: string, args: any) => performChoose(policyName, args),
    setDelay,
    setModel,
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
