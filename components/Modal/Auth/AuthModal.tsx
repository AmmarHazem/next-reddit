import { authModalStateAtom } from "@/atoms/authModalAtom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";

const AuthModal: FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalStateAtom);

  const handleClose = () => {
    setModalState((prevState) => {
      return { ...prevState, open: false };
    });
  };

  let title: string;
  if (modalState.view === "login") {
    title = "Log In";
  } else if (modalState.view === "signup") {
    title = "Sign Up";
  } else {
    title = "Reset Password";
  }

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Flex direction="column" align="center" justify="center" width="70%">
              <OAuthButtons />
              <Text color="gray.500" fontWeight="700">
                OR
              </Text>
              <AuthInputs />
              {/* <ResetPassword /> */}
            </Flex>
          </ModalBody>
          {/* <ModalFooter></ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
};

interface AuthModalProps {}

export default AuthModal;
