import moment from 'moment';
import { DISPLAY_DATE_FORMAT } from './constants';

export const formatDate = (date) => {
    return moment(date).format(DISPLAY_DATE_FORMAT);
};

export const formatDateForAPI = (date) => {
    return moment(date).format('YYYY-MM-DD');
};

export const calculateAge = (birthDate) => {
    return moment().diff(birthDate, 'years');
};

export const formatNumber = (num) => {
    return num.toLocaleString();
};

export const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
};