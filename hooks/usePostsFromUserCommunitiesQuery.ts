import { communityStateAtom } from "@/atoms/communitiesAtom";
import { auth } from "@/firebase/clientApp";
import { getPostsFromCommunities } from "@/services/postsServices";
import { useToast } from "@chakra-ui/react";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";

function usePostsFromUserCommunitiesQuery() {
  const [user] = useAuthState(auth);
  const taost = useToast();
  const communityState = useRecoilValue(communityStateAtom);

  const userCommunitiesIDs = useMemo<string[]>(() => {
    return communityState.userCommunitySnippets.map<string>((snippet) => snippet.communityID);
  }, [communityState.userCommunitySnippets]);

  const queryKey = useMemo<string[]>(() => {
    return ["posts", ...userCommunitiesIDs];
  }, [userCommunitiesIDs]);

  const query = useQuery(queryKey, () => getPostsFromCommunities({ communities: userCommunitiesIDs }), {
    enabled: !!user?.uid,
    onError: () => taost({ status: "error", title: "Something went wrong" }),
  });

  return { query, queryKey, userCommunitiesIDs };
}

export default usePostsFromUserCommunitiesQuery;
