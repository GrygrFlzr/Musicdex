import {
  Box,
  CloseButton,
  Divider,
  BoxProps,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import {
  FiClock,
  FiStar,
  FiHeart,
  FiHome,
  FiPlusCircle,
  FiSettings,
} from "react-icons/fi";
import { useClient } from "../../modules/client";
import {
  useMyPlaylists,
  useStarredPlaylists,
} from "../../modules/services/playlist.service";
import { NavItem } from "./NavItem";
import { OrgSelector } from "./OrgSelector";
import { useLocation } from "react-router-dom";
import { useStoreState } from "../../store";
import { AnimatePresence } from "framer-motion";

import { Flex, useColorModeValue } from "@chakra-ui/react";
import { Suspense } from "react";
import { PlaylistList } from "../playlist/PlaylistList";
import { LogoWithText } from "./LogoWithText";
import { PlaylistCreateModal } from "../playlist/PlaylistCreateForm";

interface SidebarProps extends BoxProps {
  onClose: () => void;
  closeOnNav?: boolean;
  linkItems?: LinkItemProps[];
}
export interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
  disabled?: boolean;
}

const LinkItems: Array<LinkItemProps> = [
  // { name: "Home", icon: FiHome, path: "/" },
  { name: "Recently Played", icon: FiClock, path: "/history" },
  { name: "Liked Songs", icon: FiHeart, path: "/liked" },
  // { name: "My Playlists", icon: FiServer, path: "/playlists" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

export function SidebarContent({
  linkItems = LinkItems,
  closeOnNav = false,
  onClose,
  ...rest
}: SidebarProps) {
  const { user } = useClient();
  const { data: playlistList, isLoading: loadingMine } = useMyPlaylists();
  const { data: starredList, isLoading: loadingStars } = useStarredPlaylists();
  // console.log(playlistList, starredList);
  const { pathname } = useLocation();
  const isDragging = useStoreState((s) => s.dnd.dragging);
  const toast = useToast();
  const { onOpen: openModal, ...modalProps } = useDisclosure();
  return (
    <Box
      display="flex"
      flexDirection="column"
      transition="3s ease"
      bg={useColorModeValue("bg.100", "bg.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", lg: 60 }}
      flexShrink={0}
      // pos="fixed"
      h="full"
      {...rest}
    >
      <Flex
        h="20"
        alignItems="center"
        mx="4"
        justifyContent="space-between"
        display={{ base: "flex", lg: "none" }}
      >
        <LogoWithText />
        <CloseButton onClick={onClose} />
      </Flex>
      <NavItem icon={FiHome} key={"Home"} mb={4} path="/">
        Home
      </NavItem>
      <AnimatePresence>{pathname === "/" && <OrgSelector />}</AnimatePresence>
      {linkItems.map((link) => (
        <NavItem {...link} key={link.name} mb={4}>
          {link.name}
        </NavItem>
      ))}
      <Divider mb={2} />
      <Flex flexDirection="column" overflowY="auto" flex="1">
        <PlaylistCreateModal {...modalProps} />
        <NavItem
          key="playlist"
          icon={FiPlusCircle}
          onClick={(e) => {
            if (!user?.id)
              return toast({
                variant: "solid",
                status: "warning",
                position: "top-right",
                description: "You need to be logged in to create playlists.",
                isClosable: true,
              });
            openModal();
          }}
          m="1"
          px="2"
          py="1"
        >
          Create New Playlist
        </NavItem>
        <Suspense fallback={"..."}>
          {playlistList && (
            <PlaylistList
              playlistStubs={playlistList as any}
              vibe={isDragging}
            />
          )}
          <Divider my={2} />
          {starredList && (
            <PlaylistList
              playlistStubs={starredList as any}
              defaultIcon={FiStar}
            />
          )}
        </Suspense>
      </Flex>
    </Box>
  );
}
