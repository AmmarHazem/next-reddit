import { authModalStateAtom } from "@/atoms/authModalAtom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { FC, useState, ChangeEvent } from "react";
import { useSetRecoilState } from "recoil";

const LoginForm: FC = () => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const setAuthModalState = useSetRecoilState(authModalStateAtom);

  const handleFormSubmit = () => {};

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prevValue) => {
      return { ...prevValue, [e.target.name]: e.target.value };
    });
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ width: "100%" }}>
      <Flex direction="column" gap="8px">
        <Input
          required={true}
          fontSize="10pt"
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleInputChange}
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
        />
        <Input
          required={true}
          fontSize="10pt"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleInputChange}
        />
        <Button type="submit" height="36px" marginTop="8px">
          Log In
        </Button>
        <Flex fontSize="9pt" gap="8px" justifyContent="center">
          <Text>New here ?</Text>
          <Text
            color="blue.500"
            fontWeight="700"
            cursor="pointer"
            onClick={() => {
              setAuthModalState((prevValue) => {
                return { ...prevValue, view: "signup" };
              });
            }}
          >
            SIGN UP
          </Text>
        </Flex>
      </Flex>
    </form>
  );
};

export default LoginForm;
