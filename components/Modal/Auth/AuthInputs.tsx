import { authModalStateAtom } from "@/atoms/authModalAtom";
import { Flex } from "@chakra-ui/react";
import { FC } from "react";
import { useRecoilValue } from "recoil";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthInputs: FC = () => {
  const authModalState = useRecoilValue(authModalStateAtom);

  return (
    <Flex direction="column" align="center" width="100%" mt={4}>
      {authModalState.view === "login" && <LoginForm />}
      {authModalState.view === "signup" && <SignUpForm />}
    </Flex>
  );
};

export default AuthInputs;
