import { CommunityModel, CommunitySnippetModel } from "@/atoms/communitiesAtom";
import { PostModel } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { QueryFunctionContext } from "react-query";
import safeJsonStringify from "safe-json-stringify";

export async function getHighestNumberOfMemebersCommunities(): Promise<CommunityModel[] | null> {
  try {
    const communityQuery = query(collection(firestore, "communities"), orderBy("numberOfMembers", "desc"), limit(5));
    const communitiesDocs = await getDocs(communityQuery);
    const communities = communitiesDocs.docs.map<CommunityModel>((doc) => ({ id: doc.id, ...doc.data() } as CommunityModel));
    return communities;
  } catch (error) {
    console.log("--- getCommunityRecommendations error", error);
    return null;
  }
}

export async function getUserCommunitySnippets({ userID }: { userID: string }): Promise<CommunitySnippetModel[] | null> {
  try {
    const snippetDocs = await getDocs(collection(firestore, `users/${userID}/communitySnippets`));
    const snippets = snippetDocs.docs.map<CommunitySnippetModel>((doc) => doc.data() as CommunitySnippetModel);
    return snippets;
  } catch (error) {
    console.log("--- getUserCommunitySnippets error", error);
    return null;
  }
}

export async function getCommunityPosts(queryContext: QueryFunctionContext<[string, string], any>): Promise<PostModel[] | null> {
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
    console.log("--- getCommunityPosts error", e, queryContext.queryKey);
    return null;
  }
}

export async function getCommunity({ communityID }: { communityID: string }): Promise<CommunityModel | null> {
  try {
    const communityDocRef = doc(firestore, "communities", communityID);
    const communityDoc = await getDoc(communityDocRef);
    if (communityDoc.exists()) {
      const communityData = communityDoc.data();
      return JSON.parse(safeJsonStringify({ id: communityDoc.id, ...(communityData ?? {}) }));
    } else {
      return { id: communityDoc.id };
    }
  } catch (e) {
    console.log("--- getCommunity error", e);
    return null;
  }
}
