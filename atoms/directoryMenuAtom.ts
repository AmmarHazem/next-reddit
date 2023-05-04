import { MenuListItemProps } from "@/components/Navbar/Directory/MenuListItem";
import { TiHome } from "react-icons/ti";
import { atom } from "recoil";

// export type DirectoryMenuItem = {}

interface DirectoryMenuState {
  isOpen: boolean;
  selectedMenuItem: MenuListItemProps;
}

export const defaultMenuItem: MenuListItemProps = {
  displayText: "Home",
  communityLink: "/",
  icon: TiHome,
  iconColor: "black",
};

export const defaultMenuState: DirectoryMenuState = {
  isOpen: false,
  selectedMenuItem: defaultMenuItem,
};

export const directoryMenuAtom = atom<DirectoryMenuState>({ key: "directoryMenuAtom", default: defaultMenuState });
