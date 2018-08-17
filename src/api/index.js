let root = ''
export const isPro = process.env.NODE_ENV === 'production'
export const mock = process.env.MOCK
if (isPro) {
  root = '/api'
} else {
  // root = '/testapi'
  root = '/devapi'
}
let path = (inf = null, n) => {
  let result = ''
  if (isPro) {
    result = root + inf
  } else {
    switch (mock) {
    case 'local':
      console.warn('本地mock数据模式')
      result = root + '/local' + inf
      break
    case 'cross':
      console.warn('远程mock数据模式')
      result = root + '/cross' + inf
      break
    case 'mixin':
      if (n) {
        result = root + '/local' + inf
      } else {
        result = root + '/cross' + inf
        // result = root + '/cross/api' + inf
      }
      break
    }
  }
  return result
}
/*
corss  请求远端
local  请求本地mock Json 文件

example:
export const ILOGIN = root + login
*/

export const IDEMO = path('/demo', true)
export const ARTICLELIST = path('/article/list', true)
export const FORMMODELCONFIG = path('/formModel/config', true)
