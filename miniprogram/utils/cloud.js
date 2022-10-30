async function callFunction(url, data = {}) {
  const [name, funName, funAction] = url.split('/')

  const res = await wx.cloud.callFunction({
    name,
    data: {
      funName,
      funAction,
      ...data,
    }
  })
  console.log(res)
  const { errMsg, result } = res
  const { errCode, ...rest } = result
  console.log(rest)

  if (errCode === 0 || errMsg === 'cloud.callFunction:ok') {
    return rest
  } else {
    throw Error(errMsg)
  }
}

module.exports = {
  callFunction,
}