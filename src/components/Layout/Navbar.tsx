import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";
import { AccountContext } from "../../contexts/AccountContext";
import { AuthContext } from "../../contexts/AuthContext";

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const Navbar = ({ onOpen, ...rest }: MobileProps) => {
  const { logout } = useContext(AuthContext);
  const { account, accounts, changeAccount } = useContext(AccountContext);

  return (
    <Flex
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg="gray.900"
      borderBottomWidth="1px"
      borderBottomColor="gray.700"
      justifyContent="space-between"
      {...rest}
    >
      <Flex
        display={{ base: "none", md: "flex" }}
        alignItems="center"
        mx="8"
        justifyContent="space-between"
      >
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Logo
        </Text>
      </Flex>
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: "flex", md: "none" }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold"
      >
        Logo
      </Text>

      <HStack spacing={{ base: "0", md: "6" }}>
        <Select
          value={account?.id}
          onChange={(event) => changeAccount(event.target.value)}
        >
          {accounts &&
            accounts.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
        </Select>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={"center"}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: "none" }}
            >
              <HStack>
                <Avatar
                  size={"sm"}
                  src={"https://avatars.githubusercontent.com/u/48969567?v=4"}
                />
                <VStack
                  display={{ base: "none", md: "flex" }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Justina Clark</Text>
                  <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text>
                </VStack>
                <Box display={{ base: "none", md: "flex" }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList bg="gray.900" borderColor="gray.700">
              <MenuItem>Seu Perfil</MenuItem>
              <MenuItem>Configura????es</MenuItem>
              <MenuItem>Sobre</MenuItem>
              <MenuDivider />
              <MenuItem onClick={logout}>Sair</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};

export default Navbar;
