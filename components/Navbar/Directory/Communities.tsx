import CreateCommunityModal from "@/components/Modal/CreateCommunity/CreateCommunityModal";
import { Flex, MenuItem, Icon } from "@chakra-ui/react";
import { FC, useState } from "react";
import { GrAdd } from "react-icons/gr";

const Communities: FC<CommunitiesProps> = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <>
      <CreateCommunityModal onClose={() => setOpenModal(false)} open={openModal} />
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: "gray.100" }}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Flex align="center" gap="8px">
          <Icon as={GrAdd} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
};

interface CommunitiesProps {}

export default Communities;
