import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthNavigator from './AuthNavigator';
import KycNavigator from './KycNavigator';
import MainNavigator from './MainNavigator';

const RootNavigator = () => {
  const { isLoggedIn, kycStatus } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isLoggedIn) return <AuthNavigator />;
  if (kycStatus !== 'COMPLETED') return <KycNavigator />;

  return <MainNavigator />;
};

export default RootNavigator;
