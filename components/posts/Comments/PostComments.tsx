import CommentModel from "@/models/CommentModel";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import usePostCommentsQuery from "@/hooks/usePostCommentsQuery";
import { postAtom, PostModel, PostState } from "@/atoms/postAtom";
import { auth, firestore } from "@/firebase/clientApp";
import { deleteComment } from "@/services/commentsServices";
import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  useToast,
  Text,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { collection, doc, increment, Timestamp, writeBatch } from "firebase/firestore";
import { FC, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

const PostComments: FC<PostCommentsProps> = ({ communityID, post }) => {
  // const [comments, setComments] = useState<CommentModel[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [loadingCreateComment, setLoadingCreateComment] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const [selectedDeleteComment, setSelectedDeleteComment] = useState<CommentModel>();
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
        createdAt: { seconds: Date.now() / 1000 } as Timestamp, // serverTimestamp() as Timestamp,
      };
      batch.set(commentDocRef, newComment);
      const postDocRef = doc(firestore, "posts", post.id!);
      batch.update(postDocRef, { numberOfComments: increment(1) });
      await batch.commit();
      setCommentText("");
      // setComments((value) => [newComment, ...value]);
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
      queryClient.setQueryData(postCommentsQueryKey, (prevValue: any) => {
        if (!prevValue) return [newComment];
        const newValue: CommentModel[] = JSON.parse(JSON.stringify(prevValue));
        newValue.unshift(newComment);
        return newValue;
      });
    } catch (error) {
      console.log("--- onCreateCommnet error", error);
      toast({ status: "error", title: "Something went wrong" });
    } finally {
      setLoadingCreateComment(false);
    }
  };

  const queryClient = useQueryClient();
  const { query: postCommentsQuery, queryKey: postCommentsQueryKey } = usePostCommentsQuery(post.id);
  const deleteCommentMutation = useMutation({ mutationFn: deleteComment });

  const onDeleteComment = async () => {
    if (!selectedDeleteComment) return;
    const success = await deleteCommentMutation.mutateAsync({ commentID: selectedDeleteComment.id, postID: post.id! });
    if (success) {
      setPostState((oldValue) => {
        const newValue: PostState = { ...oldValue };
        const selectedPost = newValue.selectedPost!;
        newValue.selectedPost = {
          numberOfComments: selectedPost.numberOfComments - 1,
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
      queryClient.setQueryData(postCommentsQueryKey, (prevValue: any) => {
        if (!prevValue) return prevValue;
        const newValue: CommentModel[] = JSON.parse(JSON.stringify(prevValue));
        return newValue.filter((c) => c.id !== selectedDeleteComment.id);
      });
    } else {
      toast({ status: "error", title: "Something went wrong" });
    }
    setSelectedDeleteComment(undefined);
  };

  return (
    <>
      <Box bg="white" borderRadius="0px 0px 4px 4px">
        <Flex direction="column" paddingLeft={10} paddingRight={4} mb={6} fontSize="10pt" width="100%">
          <CommentInput
            commentText={commentText}
            loadingCreateComment={loadingCreateComment}
            onCreateComment={onCreateCommnet}
            setCommentText={setCommentText}
          />
        </Flex>
        <Stack spacing={6} p={2}>
          {postCommentsQuery.isLoading ? (
            <>
              {[1, 2, 3].map((i) => {
                return (
                  <Box key={i} padding="6" bg="white">
                    <SkeletonCircle size="10" />
                    <SkeletonText mt={4} noOfLines={2} spacing={4} />
                  </Box>
                );
              })}
            </>
          ) : (
            <>
              {(postCommentsQuery.data?.length ?? 0) === 0 ? (
                <Flex direction="column" justify="center" alignItems="center" borderTop="1px solid" borderColor="gray.100" p={20}>
                  <Text fontWeight={700} opacity={0.3}>
                    No Comments yet
                  </Text>
                </Flex>
              ) : (
                postCommentsQuery.data?.map((comment) => {
                  return (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      loadingDelete={deleteCommentMutation.variables?.commentID === comment.id && deleteCommentMutation.isLoading}
                      onDeleteComment={() => setSelectedDeleteComment(comment)}
                    />
                  );
                })
              )}
            </>
          )}
        </Stack>
      </Box>
      <Modal isOpen={!!selectedDeleteComment} onClose={() => setSelectedDeleteComment(undefined)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you would like to delete this comment ?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="ghost" mr={3} onClick={onDeleteComment} isLoading={deleteCommentMutation.isLoading}>
              Yes
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedDeleteComment(undefined)}
              isLoading={deleteCommentMutation.isLoading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface PostCommentsProps {
  post: PostModel;
  communityID: string;
}

export default PostComments;
