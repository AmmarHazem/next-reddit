import { communityStateAtom } from "@/atoms/communitiesAtom";
import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { Flex, MenuItem, Icon, Box, Text } from "@chakra-ui/react";
import { FC, useMemo, useState } from "react";
import { FaReddit } from "react-icons/fa";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import MenuListItem from "./MenuListItem";

const Communities: FC<CommunitiesProps> = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const userCommunitySnippets = useRecoilValue(communityStateAtom).userCommunitySnippets;

  const moderatingCommunities = useMemo(() => {
    return userCommunitySnippets.filter((snippet) => snippet.isModerator);
  }, [userCommunitySnippets]);

  return (
    <>
      <CreateCommunityModal onClose={() => setOpenModal(false)} open={openModal} />
      <Box mt={3} mb={4}>
        {moderatingCommunities.length > 0 && (
          <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
            MODERATING
          </Text>
        )}
        {moderatingCommunities.map((snippet) => {
          return (
            <MenuListItem
              key={snippet.communityID}
              displayText={`r/${snippet.communityID}`}
              communityLink={`/r/${snippet.communityID}`}
              iconColor={"brand.100"}
              imageURL={snippet.imageURL}
              icon={FaReddit}
            />
          );
        })}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <Flex align="center" gap="8px">
            <Icon as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {userCommunitySnippets.map((snippet) => {
          return (
            <MenuListItem
              key={snippet.communityID}
              displayText={`r/${snippet.communityID}`}
              communityLink={`/r/${snippet.communityID}`}
              iconColor={"blue.500"}
              imageURL={snippet.imageURL}
              icon={FaReddit}
            />
          );
        })}
      </Box>
    </>
  );
};

interface CommunitiesProps {}

export default Communities;
