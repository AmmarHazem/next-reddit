import { PostModel } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import { collection, doc, getDocs, limit, orderBy, query, where } from "@firebase/firestore";
import { getDoc } from "firebase/firestore";
import safeJsonStringify from "safe-json-stringify";

export async function getPostsFromCommunities({ communities }: { communities: string[] }): Promise<PostModel[] | null> {
  if (!communities.length) return [];
  try {
    const postsQuery = query(collection(firestore, "posts"), where("communityID", "in", communities), limit(20));
    const postDocs = await getDocs(postsQuery);
    const posts = postDocs.docs.map<PostModel>((doc) => {
      return { id: doc.id, ...doc.data() } as PostModel;
    });
    return posts;
  } catch (error) {
    console.log("--- getPostsFromCommunities error", error);
    return null;
  }
}

export async function getMostPupularPosts(): Promise<PostModel[] | null> {
  try {
    const postsQuery = query(collection(firestore, "posts"), orderBy("voteStatus", "desc"), limit(20));
    const postDocs = await getDocs(postsQuery);
    const posts = postDocs.docs.map((post) => {
      return { id: post.id, ...post.data() };
    });
    return posts as PostModel[];
  } catch (error) {
    console.log("--- getMostPupularPosts error", error);
    return null;
  }
}

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
