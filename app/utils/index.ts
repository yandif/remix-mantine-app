import dayjs from 'dayjs';

import Auth from './Auth';

/**
 * @description 转换时间格式
 * @example
 * formatDate(new Date()) //2021-08-14
 * formatDate(new Date(),true) //2021-08-14 00:25:49
 * @param dateNum
 * @param isHourMinuteSecond
 * @returns
 */
export const formatDate = (
  dateNum: any,
  isHourMinuteSecond = false,
): string => {
  if (!dateNum) {
    return '';
  }
  return dayjs(dateNum).format(
    `YYYY-MM-DD${isHourMinuteSecond ? ' HH:mm:ss' : ''}`,
  );
};

/**
 * @description 生成校验密码
 * @example
 * const md5pwd = auth.makePassword('123123');
 * auth.checkPassword('123123', md5pwd);
 */
export const auth = new Auth();

/**
 * @description 判断是否是对象
 * @example
 * isObject({}) // true
 * isObject([]) // false
 */
export const isObject = (obj: any) => {
  return Object.is(Object.prototype.toString.call(obj), '[object Object]');
};
