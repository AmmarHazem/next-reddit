import useCommunityData from "@/hooks/useCommunityData";
import { CommunityModel } from "@/atoms/communitiesAtom";
import { pageContentMaxWidth } from "@/constants";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FaReddit } from "react-icons/fa";

const CommunityHeader: FC<CommunityHeaderProps> = ({ community }) => {
  const { communityState, handleJoinOrLeaveCommunity, loading } = useCommunityData();
  const isJoined = communityState.userCommunitySnippets.some((com) => com.communityID === community.id);
  // const communityState = useRecoilValue(communityStateAtom);

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" backgroundColor="blue.400" />
      <Flex justify="center" bg="white" flexGrow="1">
        <Flex width="95%" maxW={pageContentMaxWidth}>
          {community.imageURL ? (
            <Image
              src={communityState.currentCommunity?.imageURL ?? community.imageURL}
              alt={community.id}
              objectFit="cover"
              borderRadius="full"
              boxSize="66px"
              position="relative"
              top="-3"
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              pos="relative"
              top="-10px"
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {community.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                {community.id}
              </Text>
            </Flex>
            <Button
              isLoading={loading}
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              onClick={() => handleJoinOrLeaveCommunity(community, isJoined)}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface CommunityHeaderProps {
  community: CommunityModel;
}

export default CommunityHeader;
