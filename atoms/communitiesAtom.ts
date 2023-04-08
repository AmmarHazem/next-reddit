import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type CommunityType = "public" | "restricted" | "private";

export interface CommunityModel {
  id: string;
  creatorID?: string;
  numberOfMembers?: number;
  privacyType?: CommunityType;
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippetModel {
  communityID: string;
  isModerator?: boolean;
  imageURL?: string;
}

export interface CommunityState {
  userCommunitySnippets: CommunitySnippetModel[];
  // visitedCommunities
  currentCommunity?: CommunityModel;
}

const initState: CommunityState = {
  userCommunitySnippets: [],
};

export const communityStateAtom = atom<CommunityState>({
  key: "communityState",
  default: initState,
});
