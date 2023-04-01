import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export interface PostModel {
  id?: string;
  communityID: string;
  creatorID: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  communityImageURL?: string;
  createdAt: Timestamp;
}

interface PostState {
  selectedPost: PostModel | null;
  posts: PostModel[];
}

const initialState: PostState = {
  posts: [],
  selectedPost: null,
};

export const postAtom = atom<PostState>({ key: "postState", default: initialState });
