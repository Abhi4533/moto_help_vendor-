import React from 'react';
import { DashboardContext } from '../Layout/DashboardContext';
import DashboardLayout from '../Layout/Layout';
import FirstScreen from './components/FirstScreen';
import SecondScreen from './components/SecondScreen';

const MainDashboard = () => {
  return (
    <DashboardLayout>
      <DashboardContext.Consumer>
        {context =>
          context ? (
            <>
              {[
                context.activeData,
                context.avilableData,
                context.processData,
              ]?.some(data => (data?.length ?? 0) > 0) ? (
                <SecondScreen />
              ) : (
                <FirstScreen />
              )}
            </>
          ) : null
        }
      </DashboardContext.Consumer>
    </DashboardLayout>
  );
};

export default MainDashboard;
