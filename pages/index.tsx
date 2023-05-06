import Head from "next/head";
import useMostPopularPostsQuery from "@/hooks/useMostPopularPostsQuery";
import PageContent from "@/components/Layout/PageContent";
import PostLoader from "@/components/posts/PostLoader";
import CreatePostLink from "@/components/community/CreatePostLink";
import UserHomePostsList from "@/components/UserHomePostsList";
import NoUserHomePostsList from "@/components/NoUserHomePostsList";
import useUserCommunitySnippetsQuery from "@/hooks/useUserCommunitySnippetsQuery";
import usePostsFromUserCommunitiesQuery from "@/hooks/usePostsFromUserCommunitiesQuery";
import Recommendations from "@/components/community/Recommendations";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/clientApp";
import { useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import { useQueryClient } from "react-query";
import Premium from "@/components/community/Premium";
import PersonalHome from "@/components/community/PersonalHome";

export default function Home() {
  useUserCommunitySnippetsQuery();
  const queryClient = useQueryClient();
  const [user, loadingUser] = useAuthState(auth);

  const { queryKey: mostPopularPostsQueryKey } = useMostPopularPostsQuery({
    enabled: !user && !loadingUser,
  });

  const { queryKey: userCommunityPostsQueryKey } = usePostsFromUserCommunitiesQuery();

  // const buildUserHomeFeed = useCallback(() => {}, []);

  // const buildNoUserHomeFeed = useCallback(() => {
  //   setLoading(true);
  //   try {
  //   } catch (error) {
  //     console.log("--- buildNoUserHomeFeed error", error);
  //     toast({ status: "error", title: "Something went wrong" });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [toast]);

  // const getUserPostVotes = useCallback(() => {}, []);

  useEffect(() => {
    if (user) {
      queryClient.resetQueries(mostPopularPostsQueryKey);
    }
  }, [mostPopularPostsQueryKey, queryClient, user]);

  useEffect(() => {
    if (!user && !loadingUser) {
      queryClient.resetQueries(userCommunityPostsQueryKey);
    }
  }, [loadingUser, queryClient, user, userCommunityPostsQueryKey]);

  // useEffect(() => {
  //   if (!user && !loadingUser) buildNoUserHomeFeed();
  // }, [buildNoUserHomeFeed, loadingUser, user]);

  let content: JSX.Element;
  if (loadingUser) {
    content = <PostLoader />;
  } else if (!user?.uid) {
    content = <NoUserHomePostsList />;
  } else {
    content = <UserHomePostsList />;
  }

  return (
    <>
      <Head>
        <title>Next Reddit</title>
        <meta name="description" content="My own version of Reddit built using NextJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageContent>
        <Stack>
          <CreatePostLink />
          {content}
        </Stack>
        <Stack spacing={5}>
          <Recommendations />
          <Premium />
          <PersonalHome />
        </Stack>
      </PageContent>
    </>
  );
}
