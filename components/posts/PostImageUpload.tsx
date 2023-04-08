import { Button, Flex, Image, Stack } from "@chakra-ui/react";
import { FC, useRef } from "react";

const PostImageUpload: FC<PostImageUploadProps> = ({ onSelectImage, setSelectedFile, setSelectedTab, selectedFile }) => {
  const selectedFileRef = useRef<HTMLInputElement | null>(null);

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {selectedFile ? (
        <>
          <Image src={selectedFile} alt="New post" maxWidth="400px" maxHeight="400px" />
          <Stack mt={4} direction="row">
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button height="28px" onClick={() => setSelectedFile(undefined)} variant="outline">
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          padding="20"
          border="1px dashed"
          borderColor="gray.200"
          width="100%"
          borderRadius={4}
        >
          <Button
            variant="outline"
            height="28px"
            onClick={() => {
              selectedFileRef.current?.click();
            }}
          >
            Upload
          </Button>
          <input ref={selectedFileRef} type="file" accept="image/*" hidden={true} onChange={onSelectImage} />
        </Flex>
      )}
    </Flex>
  );
};

interface PostImageUploadProps {
  selectedFile?: string;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value?: string) => void;
  onSelectImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default PostImageUpload;
