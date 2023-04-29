import usePostsList from "@/hooks/usePostsList";
import PostListItem from "@/components/community/PostListItem";
import PageContent from "@/components/Layout/PageContent";
import { CommunityModel } from "@/atoms/communitiesAtom";
import { auth } from "@/firebase/clientApp";
import { getCommunity } from "@/services/community";
import { GetServerSidePropsContext } from "next";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getPost } from "@/services/posts";
import { PostModel } from "@/atoms/postAtom";
import AboutCommunity from "@/components/community/AboutCommunity";
import PostComments from "@/components/posts/Comments/PostComments";

const PostDetailsPage: FC<PostDetailsPageProps> = ({ community, post }) => {
  const [user] = useAuthState(auth);
  const { postState, setPostState, onDeletePost, onVote } = usePostsList({ community: community, post: post });

  return (
    <PageContent>
      <>
        {postState.selectedPost && (
          <PostListItem
            post={postState.selectedPost}
            userIsCreator={postState.selectedPost?.creatorID === user?.uid}
            onVote={onVote}
            onDelete={onDeletePost}
            userVoteValue={postState.postVotes.find((vote) => vote.postID === postState.selectedPost?.id)?.voteValue}
          />
        )}
        {community && post && <PostComments communityID={community.id} post={post} />}
      </>
      <>{community && <AboutCommunity community={community} />}</>
    </PageContent>
  );
};

interface PostDetailsPageProps {
  community: CommunityModel | null;
  post: PostModel | null;
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: PostDetailsPageProps }> {
  const promisesResult = await Promise.all([
    getCommunity({ communityID: context.query.communityName as string }),
    getPost({ postID: context.query.postID as string }),
  ]);
  const community = promisesResult[0];
  const post = promisesResult[1];
  return {
    props: {
      community: community,
      post: post,
    },
  };
}

export default PostDetailsPage;
