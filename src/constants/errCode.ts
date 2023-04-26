export enum ERROR_CODE {
  REQUEST_NOT_FOUND = 404, // 请求未被正确路由接收
  SERVER_ERROR = 500, // 服务器内部错误

  // common error code
  TOKEN_ERROR = 1000, // token默认错误
  TOKEN_PARSE_ERROR = 1001,
  TOKEN_EXPIRED = 1002,
  MISSING_TOKEN = 1004,
  INCORRECT_PASSWORD = 1020, // 错误匹马
  PARAMETER_ERROR = 1025, // 参数错误
  DATABASE_ERROR = 1030,

  USER_ERROR = 2000, // 权限默认错误
  USER_EXISTS = 2001, // 用户已存在
  USER_NOT_FOUND = 2004, // 用户不存在
  AUTH_ERROR = 2020, // 权限错误
  ROLE_ERROR = 2030, // 角色错误

  EMAIL_ERROR = 3000, // 邮件错误

  FRIEND_ERROR = 4000,
  FRIEND_APPLICATION_ERROR = 4001, // 好友申请异常
  FRIEND_APPLICATION_EXISTS = 4002, // 好友申请已存在
  IS_FRIEND_ALREADY = 4003, // 已经是好友
  FRIEND_APPLICATION_NOT_FOUND = 4004, // 好友请求不存在
  FRIEND_APPLICATION_PROCESS_ERROR = 4020, // 处理好友请求异常

  CLUB_ERROR = 5000,
  CLUB_EXISTS = 5001,
  CLUB_NOT_FOUND = 5004,
  CHANNEL_ERROR = 5050,
  CHANNEL_EXISTS = 5051,
  CHANNEL_NOT_FOUND = 5054,

  MESSAGE_ERROR = 6000,
  UNAUTHORIZED_MESSAGE_TARGET = 6002, // 未经权限的消息
  UNRECOGNIZED_MESSAGE_TYPE = 6003,
  MESSAGE_NOT_FOUND = 6004,

  FILE_ERROR = 9000, // 文件错误
  NO_FILE_UPLOADED = 9004, // 未上传文件
}

export const ERROR_TEXT: Record<ERROR_CODE, string> = {
  [ERROR_CODE.SERVER_ERROR]: 'Server Error',
  [ERROR_CODE.TOKEN_ERROR]: 'Token Error',
  [ERROR_CODE.TOKEN_PARSE_ERROR]: 'Token Parse Error',
  [ERROR_CODE.MISSING_TOKEN]: 'Missing Token',
  [ERROR_CODE.TOKEN_EXPIRED]: 'Token Expired',
  [ERROR_CODE.PARAMETER_ERROR]: 'Parameter Error',
  [ERROR_CODE.DATABASE_ERROR]: 'Database Error',
  [ERROR_CODE.INCORRECT_PASSWORD]: 'Incorrect Password',

  [ERROR_CODE.USER_ERROR]: 'User Error',
  [ERROR_CODE.USER_EXISTS]: 'User Already Exists',
  [ERROR_CODE.USER_NOT_FOUND]: 'User Not Found',
  [ERROR_CODE.AUTH_ERROR]: 'Auth Error',
  [ERROR_CODE.ROLE_ERROR]: 'Role Error',

  [ERROR_CODE.EMAIL_ERROR]: 'Email Error',
  [ERROR_CODE.REQUEST_NOT_FOUND]: 'Request Not Responding',

  [ERROR_CODE.FRIEND_ERROR]: 'Friend Error',
  [ERROR_CODE.FRIEND_APPLICATION_ERROR]: 'Friend Application Error',
  [ERROR_CODE.FRIEND_APPLICATION_EXISTS]: 'Friend Application Already Exists.',
  [ERROR_CODE.IS_FRIEND_ALREADY]: 'Already Been Friends.',
  [ERROR_CODE.FRIEND_APPLICATION_NOT_FOUND]: 'Friend Application Not Found',
  [ERROR_CODE.FRIEND_APPLICATION_PROCESS_ERROR]: 'Error Occurred When Processing Friend Application',

  [ERROR_CODE.CLUB_ERROR]: 'Club Error',
  [ERROR_CODE.CLUB_EXISTS]: 'Club Already Exists',
  [ERROR_CODE.CLUB_NOT_FOUND]: 'Club Not Found',
  [ERROR_CODE.CHANNEL_ERROR]: 'Channel Error',
  [ERROR_CODE.CHANNEL_EXISTS]: 'Channel Already Exists',
  [ERROR_CODE.CHANNEL_NOT_FOUND]: 'Channel Not Found',

  [ERROR_CODE.MESSAGE_ERROR]: 'Message Error',
  [ERROR_CODE.UNAUTHORIZED_MESSAGE_TARGET]: 'Unauthorized Message Target',
  [ERROR_CODE.MESSAGE_NOT_FOUND]: 'Message Not Found',
  [ERROR_CODE.UNRECOGNIZED_MESSAGE_TYPE]: 'Unrecognized Message Type',

  [ERROR_CODE.FILE_ERROR]: 'File Error',
  [ERROR_CODE.NO_FILE_UPLOADED]: 'No File Uploaded',
}
