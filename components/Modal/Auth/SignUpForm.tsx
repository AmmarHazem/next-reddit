import { authModalStateAtom } from "@/atoms/authModalAtom";
import { Flex, Input, Button, Text } from "@chakra-ui/react";
import { ChangeEvent, FC, useState } from "react";
import { useSetRecoilState } from "recoil";

const SignUpForm: FC = () => {
  const [signupForm, setSignupForm] = useState({ email: "", password: "", passwordConfirmation: "" });
  const setAuthModalState = useSetRecoilState(authModalStateAtom);

  const handleFormSubmit = () => {};

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSignupForm((prevValue) => {
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
        <Input
          required={true}
          fontSize="10pt"
          name="passwordConfirmation"
          placeholder="Confirm Password"
          type="password"
          onChange={handleInputChange}
        />
        <Button type="submit" height="36px" marginTop="8px">
          Sign Up
        </Button>
        <Flex fontSize="9pt" gap="8px" justifyContent="center">
          <Text>Already a Redditor ?</Text>
          <Text
            color="blue.500"
            fontWeight="700"
            cursor="pointer"
            onClick={() => {
              setAuthModalState((prevValue) => {
                return { ...prevValue, view: "login" };
              });
            }}
          >
            LOG IN
          </Text>
        </Flex>
      </Flex>
    </form>
  );
};

export default SignUpForm;
