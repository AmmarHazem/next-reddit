import { postAtom } from "@/atoms/postAtom";
import { auth } from "@/firebase/clientApp";
import { getUserPostVotes } from "@/services/userServices";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";

function useUserPostVotesQuery({ postIDs }: { postIDs?: string[] }) {
  const [user] = useAuthState(auth);
  const setPostState = useSetRecoilState(postAtom);

  const queryKey = useMemo(() => {
    return ["user-post-votes", user?.uid];
  }, [user?.uid]);

  const query = useQuery(queryKey, () => getUserPostVotes({ userID: user!.uid, postIDs: postIDs }), {
    enabled: !!user?.uid,
    onSuccess(data) {
      if (!data) return;
      setPostState((value) => ({ ...value, postVotes: data }));
    },
  });

  return { query, queryKey };
}

export default useUserPostVotesQuery;
