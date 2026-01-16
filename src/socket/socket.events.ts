export const SOCKET_EVENTS = {
  // JOIN: 'join',
  // DRIVER_LP_DETAILS: 'driverLPDetails',
  // DRIVERS_LIVE_LOCATION: 'driver:live_location',

  // new
  JOIN: 'vendor:join',
  GET_LIVE_DRIVERS: 'vendor:get_live_drivers',
  GET_DRIVERS: 'vendor:live_drivers',
  DRIVER_LOCATION: 'vendor:driver_location',
  DRIVER_STATUS: 'vendor:driver_status',
  DRIVER_ASSIGNED: 'vendor:driver_assigned',
  NEARBY_LOADS: 'vendor:available_loads',

  UPDATE_LP_STATUS: 'vendor:update_lp_status',
  DRIVER_LIST: 'vendor:drivers_list',
  DRIVER_LP_UPDATE: 'vendor:driver_update',
  SELECT_DRIVER: 'vendor:select_driver',
  SELECTED_DRIVER_NEARBY_LOADS: 'vendor:selected_driver_loads',
};
