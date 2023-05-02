import { CommunityModel } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import safeJsonStringify from "safe-json-stringify";

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
