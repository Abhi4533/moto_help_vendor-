// dateUtils.ts
import moment from 'moment';
export const formatDate = (date: string | Date) =>
  moment(date).format('DD MMM YYYY');
export const formatDateTime = (date: string | Date) =>
  moment(date).format('DD MMM, HH:mm');
export const isPastDate = (date: string | Date) =>
  moment(date).isBefore(moment());
