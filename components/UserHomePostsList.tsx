import useMostPopularPostsQuery from "@/hooks/useMostPopularPostsQuery";
import usePostsFromUserCommunitiesQuery from "@/hooks/usePostsFromUserCommunitiesQuery";
import usePostsList from "@/hooks/usePostsList";
import useUserPostVotesQuery from "@/hooks/useUserPostVotesQuery";
import PostListItem from "./community/PostListItem";
import PostLoader from "./posts/PostLoader";
import { postAtom, PostModel } from "@/atoms/postAtom";
import { auth } from "@/firebase/clientApp";
import { FC, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const UserHomePostsList: FC = () => {
  const postState = useRecoilValue(postAtom);
  const [user] = useAuthState(auth);
  const { onSelectPost, onDeletePost, onVote } = usePostsList({ community: null, post: null });

  const { query: postsFromUserCommunitiesQuery, userCommunitiesIDs } = usePostsFromUserCommunitiesQuery();

  const { query: mostPopularPostsQuery } = useMostPopularPostsQuery({});

  const posts = useMemo<PostModel[] | null | undefined>(() => {
    if (postsFromUserCommunitiesQuery.data?.length) {
      return postsFromUserCommunitiesQuery.data;
    }
    return mostPopularPostsQuery.data;
  }, [mostPopularPostsQuery.data, postsFromUserCommunitiesQuery.data]);

  const postIDs = useMemo<string[] | undefined>(() => {
    return posts?.map<string>((post) => post.id ?? "");
  }, [posts]);

  useUserPostVotesQuery({ postIDs: postIDs });

  return (
    <>
      {postsFromUserCommunitiesQuery.isLoading || mostPopularPostsQuery.isLoading ? (
        <PostLoader />
      ) : (
        posts?.map((post) => {
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

export default UserHomePostsList;
