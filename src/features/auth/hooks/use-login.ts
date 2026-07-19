import { useLoginMutation } from "../queries/auth-query";
import { LoginFormValues } from "../schemas/login-schema";

export function useLogin() {
  const { mutate: loginFn, isPending: isPendingLogin } = useLoginMutation();

  const onSubmit = (data: LoginFormValues) => {
    loginFn(data);
  };

  return { onSubmit, isPendingLogin };
}
