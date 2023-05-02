import CommentModel from "@/models/CommentModel";
import { firestore } from "@/firebase/clientApp";
import { query, collection, where, orderBy, getDocs, writeBatch, doc, increment } from "firebase/firestore";

export async function deleteComment({ commentID, postID }: { commentID: string; postID: string }): Promise<boolean> {
  try {
    const batch = writeBatch(firestore);
    const commentDocRef = doc(firestore, "comments", commentID);
    batch.delete(commentDocRef);
    const postDocRef = doc(firestore, "posts", postID);
    batch.update(postDocRef, { numberOfComments: increment(-1) });
    await batch.commit();
    return true;
  } catch (error) {
    console.log("--- deleteComment error", error);
    return false;
  }
}

export async function getPostComments({ postID }: { postID: string }): Promise<CommentModel[] | null> {
  try {
    const commentsQuery = query(collection(firestore, "comments"), where("postID", "==", postID), orderBy("createdAt", "desc"));
    const commentDocs = await getDocs(commentsQuery);
    const comments = commentDocs.docs.map<CommentModel>((doc) => ({ ...(doc.data() as CommentModel) }));
    // console.log("--- comments", comments);
    return comments;
  } catch (e) {
    console.log("--- getPostComments error", e);
    return null;
  }
}
