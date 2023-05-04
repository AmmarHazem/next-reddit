import { CommunityModel } from "@/atoms/communitiesAtom";
import { PostModel } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { QueryFunctionContext } from "react-query";
import safeJsonStringify from "safe-json-stringify";

export async function getCommunityPosts(
  queryContext: QueryFunctionContext<[string, string | undefined], any>
): Promise<PostModel[] | null> {
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
