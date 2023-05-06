import { PostVoteModel } from "@/atoms/postAtom";
import { firestore } from "@/firebase/clientApp";
import { query, collection, getDocs, where, DocumentData, Query } from "firebase/firestore";

export async function getUserPostVotes({
  userID,
  postIDs,
}: {
  userID: string;
  postIDs?: string[];
}): Promise<PostVoteModel[] | null> {
  try {
    let postVotesQuery: Query<DocumentData>;
    if ((postIDs?.length ?? 0) > 0) {
      postVotesQuery = query(collection(firestore, "users", `${userID}/postVotes`), where("postID", "in", postIDs));
    } else {
      postVotesQuery = query(collection(firestore, "users", `${userID}/postVotes`));
    }
    const postVoteDocs = await getDocs(postVotesQuery);
    const postVotes = postVoteDocs.docs.map<PostVoteModel>((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      } as PostVoteModel;
    });
    return postVotes;
  } catch (error) {
    console.log("--- getUserPostVotes error", error);
    return null;
  }
}
