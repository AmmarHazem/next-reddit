import { CommunityModel, CommunityState, communityStateAtom } from "@/atoms/communitiesAtom";
import { auth } from "@/firebase/clientApp";
import useSelectFile from "@/hooks/useSelectFile";
import { Box, Button, Divider, Flex, Icon, Image, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage, firestore } from "@/firebase/clientApp";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { doc, updateDoc } from "firebase/firestore";
import { useSetRecoilState } from "recoil";

const AboutCommunity: FC<AboutProps> = ({ community }) => {
  const router = useRouter();
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const tasot = useToast();
  const setCommunityState = useSetRecoilState(communityStateAtom);
  const { onSelectFile, selectedFile, setSelectedFile } = useSelectFile();
  const [user] = useAuthState(auth);
  const [loadingUpload, setLoadingUpload] = useState<boolean>(false);

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setLoadingUpload(true);
    try {
      const imageRef = ref(storage, `communities/${community.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", community.id), {
        imageURL: downloadURL,
      });
      setCommunityState((prev) => {
        const newValue: CommunityState = { ...prev };
        const newCurrentCommunity: CommunityModel = { ...(newValue.currentCommunity ?? community), imageURL: downloadURL };
        newValue.currentCommunity = newCurrentCommunity;
        return newValue;
      });
    } catch (error) {
      console.log("--- AboutCommunity upload image error", error);
      tasot({ status: "error", title: "Something went wrong" });
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <Box position="sticky" top="14px">
      <Flex justify="space-between" align="center" bg="blue.400" color="white" p={3} borderRadius="4px 4px 0px 0px">
        <Text fontSize="10pt" fontWeight="700">
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" borderRadius="0px 0px 4px 4px">
        <Stack>
          <Flex width="100%" p={2} fontSize="10pt" fontWeight={700}>
            <Flex direction="column" flex="auto">
              <Text>{community.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flex="auto">
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt">
            <Icon as={RiCakeLine} fontSize={18} mr={2} />
            {community.createdAt && (
              <Text>Created at {moment((community.createdAt?.seconds ?? 0) * 1000).format("MMM DD, YYYY")}</Text>
            )}
          </Flex>
          <Link href={`/r/${router.query.communityName}/submit`}>
            <Button mt={3} height="30px">
              Create Post
            </Button>
          </Link>
          {user?.uid === community.creatorID && (
            <>
              <Divider />
              <Stack spacing={1} fontSize="10pt">
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      selectedFileRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  {community.imageURL || selectedFile ? (
                    <Image
                      src={selectedFile ?? community.imageURL}
                      alt={community.id}
                      borderRadius="full"
                      boxSize="40px"
                      objectFit="cover"
                    />
                  ) : (
                    <Icon as={FaReddit} fontSize={40} color="brand.100" mr={2} />
                  )}
                </Flex>
                {selectedFile &&
                  (loadingUpload ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input ref={selectedFileRef} type="file" accept="image/*" hidden={true} onChange={onSelectFile} />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

interface AboutProps {
  community: CommunityModel;
}

export default AboutCommunity;
