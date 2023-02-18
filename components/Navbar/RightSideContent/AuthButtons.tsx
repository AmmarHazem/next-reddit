import { authModalStateAtom } from "@/atoms/authModalAtom";
import { Button, Flex } from "@chakra-ui/react";
import React, { FC } from "react";
import { useSetRecoilState } from "recoil";

const AuthButtons: FC = () => {
  const setAuthModalState = useSetRecoilState(authModalStateAtom);

  const handleOpenLoginAuthModal = () => {
    setAuthModalState((prevValue) => {
      return { ...prevValue, open: true, view: "login" };
    });
  };

  const handleOpenSignupAuthModal = () => {
    setAuthModalState((prevValue) => {
      return { ...prevValue, open: true, view: "signup" };
    });
  };

  return (
    <Flex gap="8px" alignItems="center">
      <Button
        onClick={handleOpenLoginAuthModal}
        variant="outline"
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
      >
        Log In
      </Button>
      <Button
        onClick={handleOpenSignupAuthModal}
        height="28px"
        display={{ base: "none", sm: "flex" }}
        width={{ base: "70px", md: "110px" }}
      >
        Sign Up
      </Button>
    </Flex>
  );
};

export default AuthButtons;
