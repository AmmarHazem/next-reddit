import { getPostComments } from "@/services/commentsServices";
import { useMemo } from "react";
import { useQuery } from "react-query";

function usePostCommentsQuery(postID?: string) {
  const queryKey = useMemo(() => ["comments", postID], [postID]);

  const query = useQuery(queryKey, () => getPostComments({ postID: postID! }), { enabled: !!postID });

  return { query, queryKey };
}

export default usePostCommentsQuery;
