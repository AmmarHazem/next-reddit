import { Flex } from "@chakra-ui/react";
import { FC, useState } from "react";
import { IconType } from "react-icons";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";

const NewPostForm: FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({ title: "", post: "" });
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {};

  const handleSelectImage = () => {};

  const onTextChange = () => {};

  return (
    <Flex direction="column" bg="white" borderRadius="4px" mt={2}>
      <Flex width="100%">
        {formTabs.map<JSX.Element>((tabItem) => {
          return (
            <TabItem key={tabItem.title} tabItem={tabItem} selected={selectedTab === tabItem.title} onClick={setSelectedTab} />
          );
        })}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            handleCreatePost={handleCreatePost}
            loading={loading}
            post={textInputs.post}
            title={textInputs.title}
            onTitleChanged={(v) =>
              setTextInputs((prevValue) => {
                return { ...prevValue, title: v };
              })
            }
            onPostChanged={(v) =>
              setTextInputs((prevValue) => {
                return { ...prevValue, post: v };
              })
            }
          />
        )}
      </Flex>
    </Flex>
  );
};

const formTabs: NewPostTabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Videos",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type NewPostTabItemType = { title: string; icon: IconType };

interface NewPostFormProps {}

export default NewPostForm;
