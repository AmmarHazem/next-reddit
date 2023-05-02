import { auth } from "@/firebase/clientApp";
import CommentModel from "@/models/CommentModel";
import { Text, Box, Flex, Icon, Stack, Spinner } from "@chakra-ui/react";
import moment from "moment";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { IoArrowDownCircleOutline, IoArrowUpCircleOutline } from "react-icons/io5";

const CommentItem: FC<CommentItemProps> = ({ comment, loadingDelete, onDeleteComment }) => {
  const [user] = useAuthState(auth);

  return (
    <Flex>
      <Box mr={2}>
        <Icon as={FaReddit} fontSize={30} color="gray.300" />
      </Box>
      <Stack spacing={1}>
        <Stack direction="row" align="center" fontSize="8pt">
          <Text fontWeight={700}>{comment.creatorDisplayText}</Text>
          <Text color="gray.600">{moment(comment.createdAt.seconds * 1000).fromNow()}</Text>
          {loadingDelete && <Spinner size="sm" />}
        </Stack>
        <Text fontSize="10pt">{comment.text}</Text>
        <Stack direction="row" alignItems="center" cursor="pointer" color="gray.500">
          <Icon as={IoArrowUpCircleOutline} />
          <Icon as={IoArrowDownCircleOutline} />
          {user?.uid === comment.creatorID && (
            <>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }}>
                Edit
              </Text>
              <Text fontSize="9pt" _hover={{ color: "blue.500" }} onClick={() => onDeleteComment(comment)}>
                Delete
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Flex>
  );
};

interface CommentItemProps {
  comment: CommentModel;
  loadingDelete: boolean;
  onDeleteComment: (comment: CommentModel) => void;
}

export default CommentItem;
