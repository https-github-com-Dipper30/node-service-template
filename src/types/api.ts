import { AuthValidator } from '@/validators';
import { AllValidator, Infer } from 'aptx-validator';

type GetType<F extends () => AllValidator> = Infer<ReturnType<F>>;
type AuthInstance = typeof AuthValidator;

export namespace AuthParams {
  export type AutoLogin = GetType<AuthInstance['autoLogin']>;
  export type Login = GetType<AuthInstance['login']>;
  export type GetUsers = GetType<AuthInstance['getUsers']>;
  export type UpdateUserRole = GetType<AuthInstance['updateUserRole']>;
  export type UpdateRole = GetType<AuthInstance['updateRole']>;
  export type UpdateUserAccount = GetType<AuthInstance['updateUserAccount']>;
}
