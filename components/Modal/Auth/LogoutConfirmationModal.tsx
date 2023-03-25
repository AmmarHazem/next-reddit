import { communityStateAtom } from "@/atoms/communitiesAtom";
import logoutConfirmationModalAtom from "@/atoms/logoutConfirmationModalAtom";
import { auth } from "@/firebase/clientApp";
import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { FC } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

const LogoutConfirmationModal: FC<LogoutConfirmationModalProps> = () => {
  const resetCommunityState = useResetRecoilState(communityStateAtom);
  const [logoutConfirmationModalState, setLogoutConfirmationModalState] = useRecoilState(logoutConfirmationModalAtom);

  const onClose = () => {
    setLogoutConfirmationModalState((prevValue) => {
      return { ...prevValue, open: false };
    });
  };

  const onLogoutClicked = () => {
    signOut(auth);
    resetCommunityState();
    onClose();
  };

  return (
    <Modal isOpen={logoutConfirmationModalState.open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Are you sure you would like to logout ?</ModalHeader>
        <ModalCloseButton />
        <ModalBody display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <Button height="36px" onClick={onClose}>
            Cancel
          </Button>
          <Button height="36px" onClick={onLogoutClicked}>
            Yes
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

interface LogoutConfirmationModalProps {}

export default LogoutConfirmationModal;
