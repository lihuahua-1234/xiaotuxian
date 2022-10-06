import request from '@/utils/request'

/**
 * @param {Integer} collectType
 * @returns
 */
export const findCollect = ({ page = 1, pageSize = 10, collectType = 1 }) => {
  return request('/member/collect', 'GET', { page, pageSize, collectType })
}

export const findFootprint = ({ page = 1, pageSize = 10 }) => {
  return request('/member/browseHistory', 'GET', { page, pageSize })
}
