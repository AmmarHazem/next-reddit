import { PostModel } from "@/atoms/postAtom";
import { getMostPupularPosts } from "@/services/postsServices";
import { useToast } from "@chakra-ui/react";
import { useMemo } from "react";
import { useQuery } from "react-query";

function useMostPopularPostsQuery({
  enabled,
  onSuccess,
}: {
  enabled?: boolean;
  onSuccess?: (posts: PostModel[] | null) => void;
}) {
  const taost = useToast();

  const queryKey = useMemo(() => {
    return ["most-popular-posts"];
  }, []);

  const query = useQuery(queryKey, getMostPupularPosts, {
    enabled: enabled ?? true,
    onSuccess: onSuccess,
    onError: () => taost({ status: "error", title: "Something went wrong" }),
  });

  return { query, queryKey };
}

export default useMostPopularPostsQuery;
