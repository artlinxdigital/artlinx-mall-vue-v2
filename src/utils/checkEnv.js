/**
 * 判断是否在移动端
 * @returns true-在移动端 false-不在移动端
 */
export const isInMobile = () => {
  const isInMobileDev = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
  return isInMobileDev;
}