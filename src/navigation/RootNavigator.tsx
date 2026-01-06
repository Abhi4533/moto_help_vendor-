import { initSocket } from '@socket/socket.manager';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import AuthNavigator from './AuthNavigator';
import KycNavigator from './KycNavigator';
import MainNavigator from './MainNavigator';

const RootNavigator = () => {
  const { isLoggedIn, kycStatus, token } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!token) return;
    initSocket(token);
  }, [token]);
  if (!isLoggedIn) return <AuthNavigator />;
  if (kycStatus !== 'COMPLETED') return <KycNavigator />;

  return <MainNavigator />;
};

export default RootNavigator;
