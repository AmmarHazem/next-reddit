import { Button, Flex, Input, Stack, Textarea } from "@chakra-ui/react";
import { FC } from "react";

const TextInputs: FC<TextInputsProps> = ({ handleCreatePost, loading, onPostChanged, onTitleChanged, post, title }) => {
  return (
    <Stack spacing={3} width="100%">
      <Input
        name="title"
        value={title}
        onChange={(e) => onTitleChanged(e.target.value)}
        fontSize="10pt"
        borderRadius="4px"
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        _focus={{ outline: "none", bg: "white", border: "1px solid", borderColor: "black" }}
      />
      <Textarea
        name="post"
        value={post}
        onChange={(e) => onPostChanged(e.target.value)}
        height="100px"
        fontSize="10pt"
        borderRadius="4px"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{ outline: "none", bg: "white", border: "1px solid", borderColor: "black" }}
      />
      <Flex justify="flex-end">
        <Button height="34px" padding="0px 30px" disabled={!title || !post} isLoading={loading} onClick={handleCreatePost}>
          Post
        </Button>
      </Flex>
    </Stack>
  );
};

interface TextInputsProps {
  title: string;
  post: string;
  onTitleChanged: (value: string) => void;
  onPostChanged: (value: string) => void;
  handleCreatePost: () => void;
  loading: boolean;
}

export default TextInputs;
