import { auth } from "@/firebase/clientApp";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

const OAuthButtons: FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  const handleSigninWithGoogleClicked = async () => {
    const userCredential = await signInWithGoogle();
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
