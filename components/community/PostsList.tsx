import { CommunityModel } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePostsList from "@/hooks/usePostsList";
import { Stack } from "@chakra-ui/react";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostLoader from "../posts/PostLoader";
import PostListItem from "./PostListItem";

const PostsList: FC<PostsList> = ({ community }) => {
  const { postState, setPostState, onDeletePost, onSelectPost, onVote, postsQuery } = usePostsList(community);
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
