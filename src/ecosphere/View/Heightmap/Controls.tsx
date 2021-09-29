import React, { useState, useEffect } from 'react';
import { FlyControls, OrbitControls } from '@react-three/drei'

const Controls = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  function handleWindowSizeChange() {
          setWidth(window.innerWidth);
      }
  useEffect(() => {
          window.addEventListener('resize', handleWindowSizeChange);
          return () => {
              window.removeEventListener('resize', handleWindowSizeChange);
          }
      }, []);
  
  let isMobile: boolean = (width <= 768);
  
  return isMobile
    ? <OrbitControls /> : <FlyControls movementSpeed={35} rollSpeed={1} dragToLook />
}

export default Controls;
