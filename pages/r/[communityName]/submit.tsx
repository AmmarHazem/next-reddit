import { communityStateAtom } from "@/atoms/communitiesAtom";
import AboutCommunity from "@/components/community/AboutCommunity";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/posts/NewPostForm";
import { getCommunity } from "@/services/communityServices";
import { Box, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC } from "react";
import { useQuery } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";

const CreatePost: FC = () => {
  const router = useRouter();
  const toast = useToast();
  const [communityState, setCommunityState] = useRecoilState(communityStateAtom);

  useQuery(["community", router.query.communityName], () => getCommunity({ communityID: router.query.communityName as string }), {
    enabled: !communityState.currentCommunity && typeof router.query.communityName === "string",
    onSuccess: (community) => {
      if (!community) return toast({ status: "error", title: "Something went wrong" });
      setCommunityState((value) => ({ ...value, currentCommunity: community }));
    },
    onError: () => {
      toast({ status: "error", title: "Something went wrong" });
    },
  });

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>{communityState.currentCommunity && <AboutCommunity community={communityState.currentCommunity} />}</>
    </PageContent>
  );
};

export default CreatePost;
