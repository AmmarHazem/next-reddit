import usePostsList from "@/hooks/usePostsList";
import PostLoader from "../posts/PostLoader";
import PostListItem from "./PostListItem";
import { CommunityModel } from "@/atoms/communitiesAtom";
import { auth } from "@/firebase/clientApp";
import { Stack } from "@chakra-ui/react";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostsList: FC<PostsList> = ({ community }) => {
  const { postState, onDeletePost, onSelectPost, onVote, postsQuery } = usePostsList({ community: community, post: null });
  const [user] = useAuthState(auth);

  return (
    <>
      {postsQuery.isLoading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postState.posts.map((post) => {
            return (
              <PostListItem
                key={post.id}
                onDelete={onDeletePost}
                onSelect={onSelectPost}
                onVote={onVote}
                post={post}
                userVoteValue={postState.postVotes.find((vote) => vote.postID === post.id)?.voteValue}
                userIsCreator={user?.uid === post.creatorID}
              />
            );
          })}
        </Stack>
      )}
    </>
  );
};

interface PostsList {
  community: CommunityModel;
}

export default PostsList;
