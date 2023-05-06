import useMostPopularPostsQuery from "@/hooks/useMostPopularPostsQuery";
import usePostsList from "@/hooks/usePostsList";
import PostListItem from "./community/PostListItem";
import PostLoader from "./posts/PostLoader";
import { postAtom } from "@/atoms/postAtom";
import { auth } from "@/firebase/clientApp";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const NoUserHomePostsList: FC = () => {
  const [user, loadingUser] = useAuthState(auth);
  const { onSelectPost, onDeletePost, onVote } = usePostsList({ community: null, post: null });
  const postState = useRecoilValue(postAtom);

  const { query: mostPopularPostsQuery, queryKey: mostPopularPostsQueryKey } = useMostPopularPostsQuery({
    enabled: !user && !loadingUser,
  });

  return (
    <>
      {mostPopularPostsQuery.isLoading ? (
        <PostLoader />
      ) : (
        mostPopularPostsQuery.data?.map((post) => {
          return (
            <PostListItem
              key={post.id}
              post={post}
              onDelete={onDeletePost}
              onSelect={onSelectPost}
              onVote={onVote}
              userVoteValue={postState.postVotes.find((vote) => vote.postID === post.id)?.voteValue}
              userIsCreator={user?.uid === post.creatorID}
              homePage={true}
            />
          );
        })
      )}
    </>
  );
};

export default NoUserHomePostsList;
