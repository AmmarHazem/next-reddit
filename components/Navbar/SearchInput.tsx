import { Search2Icon } from "@chakra-ui/icons";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FC } from "react";

const SearchInput: FC<SearchInputProps> = () => {
  return (
    <Flex flexGrow={1} align="center">
      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <Search2Icon color="gray.300" mb={1} />
        </InputLeftElement>
        <Input
          placeholder="Search Reddit"
          fontSize="10pt"
          _placeholder={{ color: "gray.500" }}
          _hover={{
            bg: "white",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          _focus={{
            outline: "none",
            border: "1px solid",
            borderColor: "blue.500",
          }}
          height="34px"
          bg="gray.50"
        />
      </InputGroup>
    </Flex>
  );
};

interface SearchInputProps {}

export default SearchInput;
