import { auth } from "@/firebase/clientApp";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { FC } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaRedditSquare } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogin } from "react-icons/md";
import LogoutConfirmationModal from "@/components/Modal/Auth/LogoutConfirmationModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import logoutConfirmationModalAtom from "@/atoms/logoutConfirmationModalAtom";
import { authModalStateAtom } from "@/atoms/authModalAtom";
import { IoSparkles } from "react-icons/io5";

const UserMenu: FC = () => {
  const [user, loading] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalStateAtom);
  const [_, setLogoutConfirmationModalState] = useRecoilState(logoutConfirmationModalAtom);

  if (loading) return null;

  const handleLogoutClicked = () => {
    setLogoutConfirmationModalState((prevValue) => {
      return { ...prevValue, open: true };
    });
  };

  let menuList: JSX.Element;
  if (user) {
    menuList = (
      <MenuList>
        <MenuItem fontSize="10pt" fontWeight="700" _hover={{ bg: "blue.500", color: "white" }}>
          <Flex alignItems="center">
            <Icon as={CgProfile} fontSize={20} mr={2} />
            Profile
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem onClick={handleLogoutClicked} fontSize="10pt" fontWeight="700" _hover={{ bg: "blue.500", color: "white" }}>
          <Flex alignItems="center">
            <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
            Logout
          </Flex>
        </MenuItem>
      </MenuList>
    );
  } else {
    menuList = (
      <MenuList>
        <MenuItem
          onClick={() => {
            setAuthModalState((prevValue) => {
              return { ...prevValue, open: true, view: "login" };
            });
          }}
          fontSize="10pt"
          fontWeight="700"
          _hover={{ bg: "blue.500", color: "white" }}
        >
          <Flex alignItems="center">
            <Icon as={MdOutlineLogin} fontSize={20} mr={2} />
            Log in / Sign up
          </Flex>
        </MenuItem>
      </MenuList>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton padding="0px 6px" borderRadius={4} _hover={{ outline: "1px solid", outlineColor: "gray.200" }}>
          <Flex align="center">
            {user ? (
              <>
                <Icon fontSize={24} color="gray.300" as={FaRedditSquare} mr={1} />
                <Flex display={{ base: "none", lg: "flex" }} direction="column" fontSize="8pt" align="flex-start" mr={8}>
                  <Text fontWeight={700}>{user.displayName || user.email?.split("@")[0]}</Text>
                  <Flex>
                    <Icon as={IoSparkles} color="brand.100" mr={1} />
                    <Text color="gray.400">1 Karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon as={VscAccount} fontSize={24} color="gray.400" mr={1} />
            )}
            <ChevronDownIcon />
          </Flex>
        </MenuButton>
        {menuList}
      </Menu>
      <LogoutConfirmationModal />
    </>
  );
};

export default UserMenu;
