import { FC } from "react";
import { Flex, Icon, Image, MenuItem } from "@chakra-ui/react";
import { IconType } from "react-icons";
import useDirectory from "@/hooks/useDirectory";

const MenuListItem: FC<MenuListItemProps> = (props) => {
  const { displayText, icon, iconColor, imageURL } = props;

  const { onSelectMenuItem } = useDirectory();

  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() => {
        onSelectMenuItem(props);
      }}
    >
      <Flex alignItems="center">
        {imageURL ? (
          <Image src={imageURL} borderRadius="full" boxSize="18px" mr={2} alt={displayText} objectFit="cover" />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};

export interface MenuListItemProps {
  displayText: string;
  communityLink: string;
  iconColor: string;
  imageURL?: string;
  icon: IconType;
}

export default MenuListItem;
