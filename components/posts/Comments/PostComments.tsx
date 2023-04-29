import { postAtom, PostModel, PostState } from "@/atoms/postAtom";
import { auth, firestore } from "@/firebase/clientApp";
import CommentModel from "@/models/CommentModel";
import { Box, Flex, useToast } from "@chakra-ui/react";
import { collection, doc, increment, serverTimestamp, Timestamp, writeBatch } from "firebase/firestore";
import { FC, SetStateAction, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";

const PostComments: FC<PostCommentsProps> = ({ communityID, post }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [loadingCreateComment, setLoadingCreateComment] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const toast = useToast();
  const setPostState = useSetRecoilState(postAtom);

  const onCreateCommnet = async () => {
    if (!commentText.length) return;
    if (!user?.email) return;
    setLoadingCreateComment(true);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: CommentModel = {
        id: commentDocRef.id,
        communityID: communityID,
        creatorDisplayText: user?.email!.split("@")[0],
        creatorID: user.uid,
        postID: post.id!,
        postTitle: post.title,
        text: commentText,
        createdAt: serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);
      const postDocRef = doc(firestore, "posts", post.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });
      await batch.commit();
      setCommentText("");
      setComments((value) => [newComment, ...value]);
      setPostState((oldValue) => {
        const newValue: PostState = { ...oldValue };
        const selectedPost = newValue.selectedPost!;
        newValue.selectedPost = {
          numberOfComments: selectedPost.numberOfComments + 1,
          body: selectedPost.body,
          communityID: selectedPost.communityID,
          createdAt: selectedPost.createdAt,
          creatorDisplayName: selectedPost.creatorDisplayName,
          creatorID: selectedPost.creatorID,
          title: selectedPost.title,
          voteStatus: selectedPost.voteStatus,
          communityImageURL: selectedPost.communityImageURL,
          id: selectedPost.id,
          imageURL: selectedPost.imageURL,
        };
        return newValue;
      });
    } catch (error) {
      console.log("--- onCreateCommnet error", error);
      toast({ status: "error", title: "Something went wrong" });
    } finally {
      setLoadingCreateComment(false);
    }
  };

  const onDeleteComment = (comment: any) => {};

  const getPostComments = async () => {};

  return (
    <Box bg="white" borderRadius="0px 0px 4px 4px">
      <Flex direction="column" paddingLeft={10} paddingRight={4} mb={6} fontSize="10pt" width="100%">
        <CommentInput
          commentText={commentText}
          loadingCreateComment={loadingCreateComment}
          onCreateComment={onCreateCommnet}
          setCommentText={setCommentText}
        />
      </Flex>
    </Box>
  );
};

interface PostCommentsProps {
  post: PostModel;
  communityID: string;
}

export default PostComments;
