import { Router } from 'express'
import { AuthController, HomeController } from '@/controller'
import { AuthValidator, HomeValidator } from '@/validator'
import { TokenValidator } from '@/validator'
import NoRoute from './NoRoute'
import { AuthCode, RoleCode } from '@/constants'

const router: Router = Router()

// 账号与用户
router.post('/login', AuthValidator.postLogin, AuthController.login)
router.post('/autoLogin', AuthValidator.postAutoLogin, AuthController.autoLogin)
router.get('/users', AuthValidator.getUsers, AuthController.getUsers.bind(AuthController))
router.get('/user', AuthValidator.getUser, AuthController.getUserById)
router.get('/usernameAvailability', AuthValidator.getUsernameAvailability, AuthController.isUsernameAvailable)
// 创建管理员账号
router.post(
  '/account',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.CREATE_ACCOUNT] }),
  AuthValidator.postAccount,
  AuthController.createAccount,
)
// 修改用户权限
router.put(
  '/userAuth',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.MODIFY_ACCOUNT] }),
  AuthValidator.putUserAuth,
  AuthController.updateUserAuth,
)
// 修改用户信息，仅自己修改
router.put(
  '/user',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN] }),
  AuthValidator.putUser,
  AuthController.updateUserInfo,
)

router.post(
  '/authority',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.MODIFY_AUTH] }),
  AuthValidator.postAuthority,
  AuthController.createAuthority,
)
router.get(
  '/authorities',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ role: [AuthCode.LOGIN_ADMIN, AuthCode.CREATE_ACCOUNT] }),
  AuthValidator.getAuthorities,
  AuthController.getAuthorities,
)
router.put(
  '/authority',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.MODIFY_AUTH] }),
  AuthValidator.putAuthority,
  AuthController.updateAuthority,
)

router.post(
  '/role',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.MODIFY_AUTH] }),
  AuthValidator.postRole,
  AuthController.createRole,
)
router.get(
  '/roles',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN] }),
  AuthValidator.getRoles,
  AuthController.getRoles,
)
router.put(
  '/role',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN, AuthCode.MODIFY_AUTH] }),
  AuthValidator.putRole,
  AuthController.updateRole,
)
router.get(
  '/adminRoles',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ auth: [AuthCode.LOGIN_ADMIN] }),
  AuthController.getAdminRoles,
)

// 首页
// current active users
router.get(
  '/cau',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ role: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN] }),
  HomeValidator.getCurrentActiveUsers,
  HomeController.getCurrentActiveUsers,
)
// daily active users
router.get(
  '/dau',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ role: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN] }),
  HomeValidator.getDailyActiveUsers,
  HomeController.getDailyActiveUsers,
)
// monthly active users
router.get(
  '/mau',
  TokenValidator.verifyToken,
  TokenValidator.checkAuth({ role: [RoleCode.SUPER_ADMIN, RoleCode.ADMIN] }),
  HomeValidator.getMonthlyActiveUsers,
  HomeController.getMonthlyActiveUsers,
)

router.all('*', NoRoute)

export default router
