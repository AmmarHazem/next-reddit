import { CommunityModel } from "@/atoms/communitiesAtom";
import { pageContentMaxWidth } from "@/constants";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import { FC } from "react";
import { FaReddit } from "react-icons/fa";

const CommunityHeader: FC<CommunityHeaderProps> = ({ community }) => {
  const { communityState, handleJoinOrLeaveCommunity, loading } = useCommunityData();
  const isJoined = communityState.userCommunitySnippets.some((com) => com.communityID === community.id);

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" backgroundColor="blue.400" />
      <Flex justify="center" bg="white" flexGrow="1">
        <Flex width="95%" maxW={pageContentMaxWidth}>
          {community.imageURL ? (
            <Image src={community.imageURL} alt={community.id} />
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
