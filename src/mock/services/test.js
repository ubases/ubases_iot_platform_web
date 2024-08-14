import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const list = () => {
  return builder([
      { "dict_id": 1, "dictLabel": Mock.Random.name(), "dictType": "sys_user_sex", "dictValue": "12", "firstletter": "a", "listimg": "1.jpg", "pinyin": "aasd" },
      { "dict_id": 3, "dictLabel":  Mock.Random.name(), "dictType": "sys_user_sex", "dictValue": "0", "firstletter": "a", "listimg": "1.jpg", "pinyin": "cdf" },
    ], 'ok', 0)
}

const user = {username: '',password: ''}
const login = (options) => {
  const params = getBody(options)
  if (user.username != params.username || user.password != params.password) {
    return builder(null, '账号密码错误', -1)
  }else{
    return builder({"token":""})
  }
}

Mock.mock(/\/v1\/platform\/web\/basedata\/dictdata\/list/, 'get', list)
Mock.mock(/\/v1\/platform\/web\/system\/login/, 'post', login)