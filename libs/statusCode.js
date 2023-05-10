module.exports = {
  ok: {
    code: 'OK',
    codeNo: 0,
    message: '操作成功',
    httpStatus: 200
  },
  unknown: {
    code: 'UNKNOWN',
    codeNo: 2,
    message: '未知错误',
    httpStatus: 500
  },
  invalidArgument: {
    code: 'INVALID_ARGUMENT',
    codeNo: 3,
    message: '解析参数错误',
    httpStatus: 400
  },
  deadlineExceeded: {
    code: 'DEADLINE_EXCEEDED',
    codeNo: 4,
    message: '操作超时',
    httpStatus: 504
  },
  notFound: {
    code: 'NOT_FOUND',
    codeNo: 5,
    message: '找不到请求的资源',
    httpStatus: 404
  },
  alreadyExists: {
    code: 'ALREADY_EXISTS',
    codeNo: 6,
    message: '资料已存在',
    httpStatus: 409
  },
  permissionDenied: {
    code: 'PERMISSION_DENIED',
    codeNo: 7,
    message: '权限不足',
    httpStatus: 403
  },
  resourceExhausted: {
    code: 'RESOURCE_EXHAUSTED',
    codeNo: 8,
    message: '请求出过限制',
    httpStatus: 429
  },
  unimplemented: {
    code: 'UNIMPLEMENTED',
    codeNo: 12,
    message: '未实作',
    httpStatus: 501
  },
  internalServer: {
    code: 'INTERNAL',
    codeNo: 13,
    message: '系统内部错误',
    httpStatus: 500
  },
  unavilable: {
    code: 'UNAVAILABLE',
    codeNo: 14,
    message: '无法获取服务',
    httpStatus: 503
  },
  unauthenticated: {
    code: 'UNAUTHENTICATED',
    codeNo: 16,
    message: '请先登入',
    httpStatus: 401
  },
  invalid: {
    code: 'INVALID',
    codeNo: 17,
    message: '参数验证失败',
    httpStatus: 422
  },
  manualJobNotCompelete: {
    code: 'MANUALJOB_NOTCOMPELETE',
    codeNo: 18,
    message: '当前系统正在进行补单作业，请稍后再进行下一笔补单',
    httpStatus: 200
  },
  manualJobFailed: {
    code: 'MANUALJOB_FAILED',
    codeNo: 18,
    message: '执行补单任务失败',
    httpStatus: 200
  }
}
