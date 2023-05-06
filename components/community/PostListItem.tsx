import { PostModel } from "@/atoms/postAtom";
import {
  Button,
  CircularProgress,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";

const PostListItem: FC<PostListItemProps> = ({ onDelete, onSelect, onVote, homePage, post, userIsCreator, userVoteValue }) => {
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
  const isSinglePostPage = !onSelect;
  const taost = useToast();
  const router = useRouter();

  const handleDeleteClicked = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDelete(post);
      if (!success) {
        throw new Error();
      }
      if (isSinglePostPage) {
        router.push(`/r/${post.communityID}`);
      }
    } catch (e) {
      console.log("--- handleDeleteClicked error", e);
      taost({ status: "error", title: "Something went wrong" });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <Flex
        border="1px solid"
        bg="white"
        borderColor={isSinglePostPage ? "white" : "gray.300"}
        borderRadius={isSinglePostPage ? "4px 4px 0px 0px" : "4"}
        cursor={isSinglePostPage ? "unset" : "pointer"}
        _hover={{
          borderColor: isSinglePostPage ? "none" : "gray.500",
        }}
        onClick={onSelect ? () => onSelect(post) : undefined}
      >
        <Flex
          bg={isSinglePostPage ? "none" : "gray.100"}
          direction="column"
          align="center"
          p={2}
          width="40px"
          borderRadius={isSinglePostPage ? "0px" : "3px 0px 0px 3px"}
        >
          <Icon
            as={userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline}
            color={userVoteValue === 1 ? "brand.100" : "gray.400"}
            fontSize="22"
            onClick={(e) => onVote(e, post, 1, post.communityID)}
            cursor="pointer"
          />
          <Text fontSize="9pt">{post.voteStatus}</Text>
          <Icon
            as={userVoteValue === -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline}
            color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
            fontSize="22"
            onClick={(e) => onVote(e, post, -1, post.communityID)}
            cursor="pointer"
          />
        </Flex>
        <Flex direction="column" width="100%">
          <Stack spacing={1} p="10px">
            <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
              {homePage && (
                <>
                  {post.imageURL ? (
                    <Image src={post.imageURL} alt={post.communityID} borderRadius="full" boxSize="18px" mr={2} />
                  ) : (
                    <Icon as={FaReddit} fontSize="18pt" color="blue.500" mr={1} />
                  )}
                  <Link href={`/r/${post.communityID}`}>
                    <Text
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      fontWeight={700}
                      _hover={{ textDecoration: "underline" }}
                    >{`r/${post.communityID}`}</Text>
                  </Link>
                  <Icon as={BsDot} color="gray.500" />
                </>
              )}
              <Text>
                Posted by u/{post.creatorDisplayName} {moment(post.createdAt.seconds * 1000).fromNow()}
              </Text>
            </Stack>
            <Text fontSize="12pt" fontWeight="600">
              {post.title}
            </Text>
            <Text fontSize="10pt">{post.body}</Text>
            {post.imageURL && (
              <Flex justify="center" align="center" p={2}>
                {loadingImage && <Skeleton height="200px" width="100%" borderRadius={4} />}
                <Image
                  src={post.imageURL}
                  alt={post.title}
                  maxHeight="460px"
                  display={loadingImage ? "none" : "unset"}
                  onLoad={() => {
                    setLoadingImage(false);
                  }}
                />
              </Flex>
            )}
          </Stack>
          <Flex ml={1} mb={0.5} color="gray.500" fontWeight="600">
            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{ bg: "gray.200" }} cursor="pointer">
              <Icon as={BsChat} mr={2} />
              <Text fontSize="9pt">{post.numberOfComments}</Text>
            </Flex>
            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{ bg: "gray.200" }} cursor="pointer">
              <Icon as={IoArrowRedoOutline} mr={2} />
              <Text fontSize="9pt">Share</Text>
            </Flex>
            <Flex align="center" p="8px 10px" borderRadius={4} _hover={{ bg: "gray.200" }} cursor="pointer">
              <Icon as={IoBookmarkOutline} mr={2} />
              <Text fontSize="9pt">Save</Text>
            </Flex>
            {userIsCreator && (
              <Flex
                align="center"
                p="8px 10px"
                borderRadius={4}
                _hover={{ bg: "gray.200" }}
                cursor="pointer"
                onClick={loadingDelete ? undefined : () => setShowDeleteConfirmationModal(true)}
              >
                <Icon as={AiOutlineDelete} mr={2} />
                <Text fontSize="9pt">Delete</Text>
                {loadingDelete && <CircularProgress isIndeterminate size={5} ml={2} />}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
      {userIsCreator && (
        <Modal isOpen={showDeleteConfirmationModal} onClose={() => setShowDeleteConfirmationModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">
              Are you sure you would like to delete post <strong>{post.title}</strong> ?
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Button height="36px" onClick={() => setShowDeleteConfirmationModal(false)}>
                Cancel
              </Button>
              <Button
                height="36px"
                onClick={(e) => {
                  setShowDeleteConfirmationModal(false);
                  handleDeleteClicked(e);
                }}
              >
                Yes
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

interface PostListItemProps {
  post: PostModel;
  userIsCreator: boolean;
  userVoteValue?: number;
  homePage?: boolean;
  onVote: (e: React.MouseEvent<SVGElement, MouseEvent>, post: PostModel, vote: number, communityID: string) => void;
  onDelete: (post: PostModel) => Promise<boolean>;
  onSelect?: (post: PostModel) => void;
}

export default PostListItem;
