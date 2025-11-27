// DashboardContext.tsx
import { clearMapData } from '@store/slices/mapSlice';
import { TAB_CONFIG } from '@utils/mapHelper';
import React, { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

interface DashboardContextProps {
  selectedTab: keyof typeof TAB_CONFIG;
  handleTabChange: (value: string) => void;
  handleHeaderButtonPress: () => void;
  idleModalVisible: boolean;
  setIdleModalVisible: (visible: boolean) => void;
  processModalVisible: boolean;
  setProcessModalVisible: (visible: boolean) => void;
  activeModalVisible: boolean;
  setActiveModalVisible: (visible: boolean) => void;
  completeModalVisible: boolean;
  setCompleteModalVisible: (visible: boolean) => void;
  setSelectedTab: (tab: keyof typeof TAB_CONFIG) => void;
}

const DashboardContext = createContext<DashboardContextProps | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [idleModalVisible, setIdleModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [activeModalVisible, setActiveModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] =
    useState<keyof typeof TAB_CONFIG>('idle');

  const handleHeaderButtonPress = (sel?: any) => {
    switch (sel || selectedTab) {
      case 'idle':
        setIdleModalVisible(true);
        break;
      case 'process':
        setProcessModalVisible(true);
        break;
      case 'active':
        setActiveModalVisible(true);
        break;
      case 'complete':
        setCompleteModalVisible(true);
        break;
      default:
        setIdleModalVisible(true);
    }
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value as keyof typeof TAB_CONFIG);
    handleHeaderButtonPress(value);
    dispatch(clearMapData());
  };

  return (
    <DashboardContext.Provider
      value={{
        selectedTab,
        handleTabChange,
        handleHeaderButtonPress,
        idleModalVisible,
        setIdleModalVisible,
        processModalVisible,
        setProcessModalVisible,
        activeModalVisible,
        setActiveModalVisible,
        completeModalVisible,
        setCompleteModalVisible,
        setSelectedTab,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
};
