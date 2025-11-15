// src/config/appConfig.ts
import { ENV } from './env';

export const APP_CONFIG = {
  appName: ENV.APP_NAME,
  apiUrl: ENV.API_URL,
  mapKey: ENV.MAP_API_KEY,
  version: ENV.VERSION,
  debug: true,
  enableLocationTracking: true,
  maxUploadSizeMB: 10,
};
