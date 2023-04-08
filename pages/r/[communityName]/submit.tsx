import { communityStateAtom } from "@/atoms/communitiesAtom";
import PageContent from "@/components/Layout/PageContent";
import NewPostForm from "@/components/posts/NewPostForm";
import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useRecoilValue } from "recoil";

const CreatePost: FC = () => {
  const { currentCommunity } = useRecoilValue(communityStateAtom);

  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        <NewPostForm />
      </>
      <>Right Content</>
    </PageContent>
  );
};

export default CreatePost;
