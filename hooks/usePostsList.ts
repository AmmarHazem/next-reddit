import { CommunityModel, communityStateAtom } from "@/atoms/communitiesAtom";
import { postAtom, PostModel, PostState, PostVoteModel } from "@/atoms/postAtom";
import { useToast } from "@chakra-ui/react";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { query, collection, where, orderBy, getDocs, doc, deleteDoc, writeBatch, getDoc } from "firebase/firestore";
import { useQuery, QueryFunctionContext } from "react-query";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { deleteObject, ref } from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCallback, useEffect } from "react";
import { authModalStateAtom } from "@/atoms/authModalAtom";

function usePostsList(community: CommunityModel) {
  const toast = useToast();
  const [user] = useAuthState(auth);
  const [postsState, setPostsState] = useRecoilState(postAtom);
  const setAuthModalState = useSetRecoilState(authModalStateAtom);
  const currentCommunity = useRecoilValue(communityStateAtom).currentCommunity;

  const onVote = async (post: PostModel, vote: number, communityID: string) => {
    try {
      if (!user?.uid) {
        return setAuthModalState({ open: true, view: "login" });
      }
      const { voteStatus } = post;
      const existingVote = postsState.postVotes.find((vote) => {
        return vote.postID === post.id;
      });
      let voteChange = vote;
      const updatedPost = structuredClone(post);
      const updatedPostsState = structuredClone(postsState);
      const batch = writeBatch(firestore);
      if (existingVote) {
        const postVoteRef = doc(firestore, "users", user.uid, "postVotes", existingVote.id);
        if (existingVote.voteValue === vote) {
          updatedPost.voteStatus -= vote;
          // updatedPostsState.postVotes = updatedPostsState.postVotes.filter((vote) => vote.id !== existingVote.id);
          updatedPostsState.postVotes = updatedPostsState.postVotes.filter((v) => v.id !== existingVote.id);
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          updatedPost.voteStatus += 2 * vote;
          // const voteIndex = postsState.postVotes.findIndex((vote) => vote.id === existingVote.id);
          updatedPostsState.postVotes.forEach((v) => {
            if (v.id === existingVote.id) {
              v.voteValue = vote;
            }
          });
          voteChange = vote * 2;
          batch.update(postVoteRef, { voteValue: vote });
        }
      } else {
        const postVoteRef = doc(collection(firestore, "users", user.uid, "postVotes"));
        const newVote: PostVoteModel = { id: postVoteRef.id, postID: post.id!, communityID: community.id, voteValue: vote };
        batch.set(postVoteRef, newVote);
        updatedPost.voteStatus = voteStatus + vote;
        updatedPostsState.postVotes.push(newVote);
      }
      const postDocRef = doc(firestore, "posts", post.id!);
      batch.update(postDocRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();
      updatedPostsState.posts = updatedPostsState.posts.map<PostModel>((p) => {
        if (p.id === updatedPost.id) {
          return updatedPost;
        }
        return p;
      });
      setPostsState(updatedPostsState);
    } catch (error) {
      console.log("--- onVote error", error);
      toast({ status: "error", title: "Something went wrong" });
    }
  };

  const onSelectPost = () => {};

  const onDeletePost: (post: PostModel) => Promise<boolean> = async (deletePost) => {
    try {
      const promises: Promise<void>[] = [];
      if (deletePost.imageURL) {
        const imageRef = ref(storage, `posts/${deletePost.id}/image`);
        promises.push(deleteObject(imageRef));
      }
      const postDocRef = doc(firestore, "posts", deletePost.id!);
      promises.push(deleteDoc(postDocRef));
      await Promise.all(promises);
      setPostsState((prevValue) => {
        const newValue = { ...prevValue };
        newValue.posts = newValue.posts.filter((post) => post.id !== deletePost.id);
        return newValue;
      });
      return true;
    } catch (e) {
      console.log("-- onDeletePost error", e);
      return false;
    }
  };

  const postsQuery = useQuery(["community", community.id], getCommunityPosts, {
    onError: () => toast({ status: "error", title: "Something went wrong" }),
    onSuccess: (res) => {
      if (res) {
        setPostsState((prevValue) => {
          return { ...prevValue, posts: res };
        });
      }
    },
  });

  const getCommunityPostVotes = useCallback(
    async (communityID: string) => {
      if (!user?.uid) return;
      const postVotesQuery = query(
        collection(firestore, "users", `${user?.uid}/postVotes`),
        where("communityID", "==", communityID)
      );
      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map<PostVoteModel>((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        } as PostVoteModel;
      });
      setPostsState((prev) => {
        const newValue: PostState = { ...prev };
        newValue.postVotes = postVotes;
        return newValue;
      });
    },
    [setPostsState, user?.uid]
  );

  useEffect(() => {
    if (!currentCommunity?.id) return;
    getCommunityPostVotes(currentCommunity.id);
  }, [currentCommunity?.id, getCommunityPostVotes]);

  useEffect(() => {
    if (!user?.uid) {
      setPostsState((prev) => {
        const newValue: PostState = { ...prev };
        newValue.postVotes = [];
        return newValue;
      });
    }
  }, [setPostsState, user?.uid]);

  return { postsQuery, postState: postsState, setPostState: setPostsState, onVote, onSelectPost, onDeletePost };
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
