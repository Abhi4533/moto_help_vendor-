// helpers.ts
import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';
import React from 'react';

export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  React.createRef();

export const navigate = (name: string, params?: object) => {
  navigationRef.current?.navigate(name, params);
};

export const reset = (name: string) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name }] }),
  );
};
