import AuthModal from "@/components/Modal/Auth/AuthModal";
import { auth } from "@/firebase/clientApp";
import { Button, Flex } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AuthButtons from "./AuthButtons";
import IconButtons from "./IconButtons";
import UserMenu from "./UserMenu";

const RightSideContent: FC<RightSideContentProps> = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return null;
  }

  const useMenu = <UserMenu />;

  if (user) {
    return (
      <>
        <IconButtons />
        {useMenu}
      </>
    );
  }

  return (
    <>
      <Flex justifyContent="center" alignItems="center">
        <AuthButtons />
        {useMenu}
      </Flex>
      <AuthModal />
    </>
  );
};

interface RightSideContentProps {}

export default RightSideContent;
