import { auth } from "@/firebase/clientApp";
import { getUserCommunitySnippets } from "@/services/communityServices";
import { useEffect, useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery, useQueryClient } from "react-query";

function useUserCommunitySnippetsQuery() {
  const [user, loadingAuthState] = useAuthState(auth);
  const queryClient = useQueryClient();

  const queryKey = useMemo(() => {
    return ["user-community-snippets", user?.uid];
  }, [user?.uid]);

  const query = useQuery(queryKey, () => getUserCommunitySnippets({ userID: user!.uid }), {
    enabled: !!user?.uid,
  });

  useEffect(() => {
    if (!user?.uid && !loadingAuthState) {
      queryClient.resetQueries(queryKey);
    }
  }, [loadingAuthState, queryClient, queryKey, user?.uid]);

  return { query, queryKey };
}

export default useUserCommunitySnippetsQuery;
