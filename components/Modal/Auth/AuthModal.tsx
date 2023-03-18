import { authModalStateAtom } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Flex, Text } from "@chakra-ui/react";
import { FC, useCallback, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import AuthInputs from "./AuthInputs";
import OAuthButtons from "./OAuthButtons";
import ResetPassword from "./ResetPassword";

const AuthModal: FC<AuthModalProps> = () => {
  const [modalState, setModalState] = useRecoilState(authModalStateAtom);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = useCallback(() => {
    setModalState((prevState) => {
      return { ...prevState, open: false };
    });
  }, [setModalState]);

  useEffect(() => {
    if (user) {
      handleClose();
    }
  }, [handleClose, user]);

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
              {modalState.view === "login" || modalState.view === "signup" ? (
                <>
                  <OAuthButtons />
                  <Text color="gray.500" fontWeight="700">
                    OR
                  </Text>
                  <AuthInputs />
                </>
              ) : (
                <>
                  <ResetPassword toggleView={() => {}} />
                </>
              )}
              {/*  */}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface AuthModalProps {}

export default AuthModal;
