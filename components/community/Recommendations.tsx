import useCommunityData from "@/hooks/useCommunityData";
import useHighestNumberOfMembersCommunities from "@/hooks/useHighestNumberOfMemebersCommunities";
import Link from "next/link";
import { Text, Box, Button, Flex, Skeleton, SkeletonCircle, Stack, Image, Icon } from "@chakra-ui/react";
import { FC } from "react";
import { FaReddit } from "react-icons/fa";

const Recommendations: FC<RecommendationsProps> = () => {
  const { communityState, handleJoinOrLeaveCommunity } = useCommunityData();
  const { query } = useHighestNumberOfMembersCommunities();

  return (
    <Flex direction="column" bg="white" borderRadius={4} border="1px solid" borderColor="gray.300">
      <Flex
        align="flex-end"
        color="white"
        padding="6px 10px"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={700}
        bgImage="url(/images/recCommsArt.png)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('images/recCommsArt.png')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {query.isLoading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {query.data?.map((community, index) => {
              const isJoined = communityState.userCommunitySnippets.some((snippet) => snippet.communityID === community.id);
              return (
                <Link key={community.id} href={`/r/${community.id}`}>
                  <Flex
                    position="relative"
                    align="center"
                    fontSize="10pt"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    p="10px 12px"
                    fontWeight={600}
                  >
                    <Flex width="80%" align="center">
                      <Flex width="15%">
                        <Text mr={2}>{index + 1}</Text>
                      </Flex>
                      <Flex align="center" width="80%">
                        {community.imageURL ? (
                          <Image
                            borderRadius="full"
                            alt={community.id}
                            boxSize="28px"
                            src={community.imageURL}
                            mr={2}
                            objectFit="cover"
                          />
                        ) : (
                          <Icon as={FaReddit} fontSize={30} color="brand.100" mr={2} />
                        )}
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >{`r/${community.id}`}</span>
                      </Flex>
                    </Flex>
                    <Box position="absolute" right="10px">
                      <Button
                        height="22px"
                        fontSize="8pt"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleJoinOrLeaveCommunity(community, isJoined);
                        }}
                        variant={isJoined ? "outline" : "solid"}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </Button>
                    </Box>
                  </Flex>
                </Link>
              );
            })}
            <Box p="10px 20px">
              <Button height="30px" width="100%">
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};

interface RecommendationsProps {}

export default Recommendations;
