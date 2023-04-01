import { Flex, useToast } from "@chakra-ui/react";
import { FC, useState } from "react";
import { IconType } from "react-icons";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import PostImageUpload from "./PostImageUpload";
import { PostModel } from "@/atoms/postAtom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const NewPostForm: FC<NewPostFormProps> = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({ title: "", post: "" });
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [user] = useAuthState(auth);
  const toast = useToast();

  const handleCreatePost = async () => {
    if (!user?.uid) return;
    const { communityName } = router.query;
    const newPost: PostModel = {
      communityID: communityName as string,
      creatorID: user?.uid,
      creatorDisplayName: user.email?.split("@")[0] ?? "",
      title: textInputs.title,
      body: textInputs.post,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, { imageURL: downloadURL });
      }
    } catch (e) {
      console.log("--- create post error", e);
      toast({ status: "error", title: "Something went wrong" });
    } finally {
      setLoading(false);
    }
    router.back();
  };

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string);
      }
    };
  };

  if (!user?.uid) return null;

  // const onTextChange = () => {};

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
        {selectedTab === "Images & Videos" && (
          <PostImageUpload
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            setSelectedTab={setSelectedTab}
            onSelectImage={handleSelectImage}
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
