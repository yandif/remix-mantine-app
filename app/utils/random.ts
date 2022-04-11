/**
 * @description 生成随机字符串
 * @param length 字符串长度
 * @example
 * const str = random(16);
 */
const random = (length = 10): string => {
  let str = '';
  const arr =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  for (let i = 0; i < length; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
};
export default random;
