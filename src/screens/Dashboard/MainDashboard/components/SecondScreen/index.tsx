import React, { FC } from 'react';
import ActiveTripsModal from './components/ActiveTripsModal';
import CompleteTripsModal from './components/CompleteTripsModal';
import IdleDriversModal from './components/IdleDriversModal';
import MapTab from './components/MapTab';
import ProcessDriversModal from './components/ProcessDriversModal';
import TabSelector from './components/TabSelector';

const SecondScreen: FC<any> = () => {
  return (
    <>
      <TabSelector />
      <MapTab />
      <IdleDriversModal />
      <ProcessDriversModal />
      <ActiveTripsModal />
      <CompleteTripsModal />
    </>
  );
};

export default SecondScreen;
