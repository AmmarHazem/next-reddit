import { directoryMenuAtom } from "@/atoms/directoryMenuAtom";
import { MenuListItemProps } from "@/components/Navbar/Directory/MenuListItem";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

function useDirectory() {
  const [directoryState, setDirectoryState] = useRecoilState(directoryMenuAtom);
  const router = useRouter();

  const onSelectMenuItem = (menItem: MenuListItemProps) => {
    setDirectoryState((value) => ({ ...value, selectedMenuItem: menItem, isOpen: false }));
    router.push(menItem.communityLink);
  };

  const toggleMenuOpen = () => {
    setDirectoryState((value) => ({ ...value, isOpen: !value.isOpen }));
  };

  return { directoryState, toggleMenuOpen, onSelectMenuItem };
}

export default useDirectory;
