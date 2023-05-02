import { PostModel } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import { doc } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import safeJsonStringify from "safe-json-stringify";

export async function getPost({ postID }: { postID: string }): Promise<PostModel | null> {
  try {
    const postDocRef = doc(firestore, "posts", postID);
    const postDoc = await getDoc(postDocRef);
    if (postDoc.exists()) {
      const postData = postDoc.data();
      return JSON.parse(safeJsonStringify({ id: postDoc.id, ...(postData ?? {}) }));
    } else {
      return null;
    }
  } catch (error) {
    console.log("--- getPost error", error);
    return null;
  }
}
