import { atom } from "recoil";

export type AuthModalViewType = "login" | "signup" | "resetPassword";

export interface AuthModalState {
  open: boolean;
  view: AuthModalViewType;
}

const defaultModalState: AuthModalState = {
  open: false,
  view: "login",
};

export const authModalStateAtom = atom<AuthModalState>({ key: "authModalState", default: defaultModalState });
