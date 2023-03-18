import { atom } from "recoil";

export interface LogoutConfirmationModalState {
  open: boolean;
}

const initialState: LogoutConfirmationModalState = {
  open: false,
};

const logoutConfirmationModalAtom = atom<LogoutConfirmationModalState>({
  key: "LogoutConfirmationModalState",
  default: initialState,
});

export default logoutConfirmationModalAtom;
