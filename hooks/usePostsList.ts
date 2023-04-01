import { CommunityModel } from "@/atoms/communitiesAtom";
import { postAtom, PostModel } from "@/atoms/postAtom";
import { useToast } from "@chakra-ui/react";
import { firestore } from "@/firebase/clientApp";
import { query, collection, where, orderBy, getDocs } from "firebase/firestore";
import { useQuery, QueryFunctionContext } from "react-query";
import { useRecoilState } from "recoil";

function usePostsList(community: CommunityModel) {
  const toast = useToast();

  const [postState, setPostState] = useRecoilState(postAtom);

  const onVote = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async () => {};

  const postsQuery = useQuery(["community", community.id], getCommunityPosts, {
    onError: () => toast({ status: "error", title: "Something went wrong" }),
    onSuccess: (res) => {
      if (res) {
        setPostState((prevValue) => {
          return { ...prevValue, posts: res };
        });
      }
    },
  });

  return { postsQuery, postState, setPostState, onVote, onSelectPost, onDeletePost };
}

async function getCommunityPosts(queryContext: QueryFunctionContext<[string, string], any>): Promise<PostModel[] | null> {
  try {
    const postsQuery = query(
      collection(firestore, "posts"),
      where("communityID", "==", queryContext.queryKey[1]),
      orderBy("createdAt", "desc")
    );
    const postDocs = await getDocs(postsQuery);
    const posts = postDocs.docs.map<PostModel>((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as PostModel;
    });
    // console.log("--- posts", posts);
    return posts;
  } catch (e) {
    console.log("--- getCommunityPosts error", e);
    return null;
  }
}

export default usePostsList;
