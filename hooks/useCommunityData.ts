import { authModalStateAtom } from "@/atoms/authModalAtom";
import { communityStateAtom, CommunityModel, CommunitySnippetModel } from "@/atoms/communitiesAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { useToast } from "@chakra-ui/react";
import { collection, doc, getDocs, increment, writeBatch } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";

function useCommunityData() {
  const setAuthModalState = useSetRecoilState(authModalStateAtom);
  const [communityState, setCommunityState] = useRecoilState(communityStateAtom);
  const [loadingSnippets, setLoadingSnippets] = useState<boolean>(false);
  const [user, loadingUser] = useAuthState(auth);
  const toast = useToast();

  const getUserSnippets = useCallback(async () => {
    if (!user?.uid) {
      return setCommunityState({ userCommunitySnippets: [] });
    }
    setLoadingSnippets(true);
    try {
      const snippetDocs = await getDocs(collection(firestore, `users/${user?.uid}/communitySnippets`));
      const snippets = snippetDocs.docs.map((doc) => doc.data());
      // console.log("--- user snippets", snippets);
      setCommunityState((prevValue) => {
        const newValue = { ...prevValue };
        newValue.userCommunitySnippets = snippets as CommunitySnippetModel[];
        return newValue;
      });
    } catch (e) {
      console.log("--- getUserSnippets error");
      console.log(e);
      toast({ status: "error", title: "Something went wrong" });
      return null;
    } finally {
      setLoadingSnippets(false);
    }
  }, [setCommunityState, toast, user?.uid]);

  const joinCommunity = useCallback(
    async (community: CommunityModel) => {
      setLoadingSnippets(true);
      try {
        const batch = writeBatch(firestore);
        const newSnippet: CommunitySnippetModel = {
          communityID: community.id,
          imageURL: community.imageURL ?? "",
          isModerator: user?.uid === community.creatorID,
        };
        batch.set(doc(firestore, `users/${user?.uid}/communitySnippets`, community.id), newSnippet);
        batch.update(doc(firestore, "communities", community.id), { numberOfMembers: increment(1) });
        await batch.commit();
        setCommunityState((prevValue) => {
          return { ...prevValue, userCommunitySnippets: [...prevValue.userCommunitySnippets, newSnippet] };
        });
      } catch (e) {
        console.log("--- joinCommunity error");
        console.log(e);
        toast({ status: "error", title: "Something went wrong" });
      } finally {
        setLoadingSnippets(false);
      }
    },
    [setCommunityState, toast, user?.uid]
  );

  const leaveCommunity = useCallback(
    async (community: CommunityModel) => {
      setLoadingSnippets(true);
      try {
        const batch = writeBatch(firestore);
        batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, community.id));
        batch.update(doc(firestore, "communities", community.id), { numberOfMembers: increment(-1) });
        await batch.commit();
        setCommunityState((prevValue) => {
          return {
            ...prevValue,
            userCommunitySnippets: prevValue.userCommunitySnippets.filter((snippet) => {
              return snippet.communityID !== community.id;
            }),
          };
        });
      } catch (e) {
        console.log("--- leaveCommunity error");
        console.log(e);
        toast({ status: "error", title: "Something went wrong" });
      } finally {
        setLoadingSnippets(false);
      }
    },
    [setCommunityState, toast, user?.uid]
  );

  const handleJoinOrLeaveCommunity = useCallback(
    (community: CommunityModel, isJoined: boolean) => {
      if (!user?.uid) {
        return setAuthModalState((prevValue) => {
          return { ...prevValue, open: true };
        });
      }
      if (isJoined) {
        return leaveCommunity(community);
      }
      joinCommunity(community);
    },
    [joinCommunity, leaveCommunity, setAuthModalState, user?.uid]
  );

  useEffect(() => {
    if (!user?.uid) {
      return setCommunityState((prevValue) => {
        const newValue = { ...prevValue };
        newValue.userCommunitySnippets = [];
        return newValue;
      });
    }
    getUserSnippets();
  }, [getUserSnippets, setCommunityState, user?.uid]);

  return {
    communityState,
    joinCommunity,
    leaveCommunity,
    handleJoinOrLeaveCommunity,
    loading: loadingSnippets || loadingUser,
  };
}

// type UseCommunityDateReturnType = {
//   communityState: CommunityState;
//   joinCommunity: () => void;
//   leaveCommunity: () => void;
//   handleJoinOrLeaveCommunity: () => void;
// };

export default useCommunityData;
