import { authModalStateAtom } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/clientApp";
import { Button, Flex, Image, Text, useToast } from "@chakra-ui/react";
import { FC } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

const OAuthButtons: FC<OAuthButtonsProps> = () => {
  const toast = useToast();
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [_, setModalState] = useRecoilState(authModalStateAtom);

  const handleSigninWithGoogleClicked = async () => {
    const userCredential = await signInWithGoogle();
    if (userCredential?.user.uid) {
      setModalState((prevValue) => {
        return { ...prevValue, open: false };
      });
    } else {
      toast({
        title: "Something went wrong",
        status: "error",
      });
    }
  };

  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        isLoading={loading}
        onClick={handleSigninWithGoogleClicked}
        variant="oauth"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="8px"
      >
        <Image src="/images/googlelogo.png" alt="Continue with Google" height="20px" />
        Continue with Google
      </Button>
      {error && <Text>{error.message}</Text>}
    </Flex>
  );
};

interface OAuthButtonsProps {}

export default OAuthButtons;
