import { Timestamp } from "firebase/firestore";

interface CommentModel {
  id: string;
  creatorID: string;
  creatorDisplayText: string;
  communityID: string;
  postID: string;
  postTitle: string;
  text: string;
  createdAt: Timestamp;
}

export default CommentModel;
