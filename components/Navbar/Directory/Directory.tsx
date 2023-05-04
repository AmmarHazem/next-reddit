import LogoutConfirmationModal from "@/components/Modal/Auth/LogoutConfirmationModal";
import useDirectory from "@/hooks/useDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Text, Flex, Icon, Menu, MenuButton, MenuList, Image } from "@chakra-ui/react";
import { FC } from "react";
import Communities from "./Communities";

const Directory: FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <>
      <Menu isOpen={directoryState.isOpen}>
        <MenuButton
          onClick={toggleMenuOpen}
          mr={2}
          ml={{ base: 0, md: 2 }}
          padding="0px 6px"
          borderRadius={4}
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        >
          <Flex
            width={{ base: "auto", lg: "100px" }}
            justifyContent="space-between"
            gap={{ base: "4px", md: "8px" }}
            align="center"
          >
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                borderRadius="full"
                boxSize="24px"
                objectFit="cover"
                src={directoryState.selectedMenuItem.imageURL}
                alt={directoryState.selectedMenuItem.displayText}
              />
            ) : (
              <Icon fontSize={24} as={directoryState.selectedMenuItem.icon} color={directoryState.selectedMenuItem.iconColor} />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
            <ChevronDownIcon />
          </Flex>
        </MenuButton>
        <MenuList>
          <Communities />
        </MenuList>
      </Menu>
      <LogoutConfirmationModal />
    </>
  );
};

export default Directory;
