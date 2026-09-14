/**
 * -----------------------------------------------------------------------------
 * File: src/components/icons/IconSymbol.tsx
 * -----------------------------------------------------------------------------
 * Brika Design System
 *
 * Centralized icon registry.
 *
 * Responsibilities:
 *
 * - Define Brika's available icons.
 * - Keep icon-family dependencies centralized.
 * - Provide a single IconSymbol component for the application.
 * - Provide strongly typed icon names.
 *
 * Components should import IconSymbol rather than importing individual icon
 * libraries directly.
 *
 * -----------------------------------------------------------------------------
 */

import React, { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesignIcon from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Octicons from "@expo/vector-icons/Octicons";

/* =============================================================================
   IONICONS
   General application UI.
============================================================================= */

export const IONICONS = {
  HomeIcon: "home",
  HomeOutlineIcon: "home-outline",

  SearchIcon: "search",
  SearchOutlineIcon: "search-outline",

  AddIcon: "add",
  CloseIcon: "close",

  MenuIcon: "menu",

  FolderIcon: "folder",
  FolderOutlineIcon: "folder-outline",

  CloudIcon: "cloud",
  CloudOutlineIcon: "cloud-outline",
  CloudUploadIcon: "cloud-upload-outline",

  CubeIcon: "cube",
  CubeOutlineIcon: "cube-outline",

  BusinessIcon: "business",
  BusinessOutlineIcon: "business-outline",

  PersonIcon: "person",
  PersonOutlineIcon: "person-outline",

  SettingsIcon: "settings",
  SettingsOutlineIcon: "settings-outline",

  BellIcon: "notifications",
  BellOutlineIcon: "notifications-outline",

  HelpCircleIcon: "help-circle",
  HelpCircleOutlineIcon: "help-circle-outline",

  InformationCircleIcon: "information-circle",
  InformationCircleOutlineIcon: "information-circle-outline",

  ChevronForwardIcon: "chevron-forward",
  ChevronBackIcon: "chevron-back",
  ChevronUpIcon: "chevron-up",
  ChevronDownIcon: "chevron-down",

  ArrowForwardIcon: "arrow-forward",
  ArrowBackIcon: "arrow-back",

  CheckmarkIcon: "checkmark",
  CheckmarkCircleIcon: "checkmark-circle",
  CheckmarkCircleOutlineIcon: "checkmark-circle-outline",

  AlertCircleIcon: "alert-circle",
  AlertCircleOutlineIcon: "alert-circle-outline",

  WarningIcon: "warning",
  WarningOutlineIcon: "warning-outline",

  TimeIcon: "time",
  TimeOutlineIcon: "time-outline",

  CalendarIcon: "calendar",
  CalendarOutlineIcon: "calendar-outline",

  DocumentIcon: "document",
  DocumentOutlineIcon: "document-outline",

  ImageIcon: "image",
  ImageOutlineIcon: "image-outline",

  DownloadIcon: "download-outline",
  UploadIcon: "cloud-upload-outline",

  TrashIcon: "trash",
  TrashOutlineIcon: "trash-outline",

  LockIcon: "lock-closed",
  LockOutlineIcon: "lock-closed-outline",

  EyeIcon: "eye",
  EyeOutlineIcon: "eye-outline",

  EyeOffIcon: "eye-off",
  EyeOffOutlineIcon: "eye-off-outline",

  LogOutIcon: "log-out",
  LogOutOutlineIcon: "log-out-outline",

  MoonIcon: "moon",
  MoonOutlineIcon: "moon-outline",

  SunnyIcon: "sunny",
  SunnyOutlineIcon: "sunny-outline",

  MenuOutlineIcon: "menu-outline",

  MoreIcon: "ellipsis-horizontal",
  MoreVerticalIcon: "ellipsis-vertical",
} as const satisfies Record<string, ComponentProps<typeof Ionicons>["name"]>;

/* =============================================================================
   MATERIAL ICONS
   Architectural / productivity icons.
============================================================================= */

export const MATERIAL_ICONS = {
  ArchitectureIcon: "architecture",

  DashboardIcon: "dashboard",
  DashboardCustomizeIcon: "dashboard-customize",

  ViewInArIcon: "view-in-ar",
  ThreeDModelIcon: "3d-rotation",

  GridIcon: "grid-view",
  ListIcon: "view-list",

  LayersIcon: "layers",

  ConstructionIcon: "construction",

  ApartmentIcon: "apartment",

  HomeWorkIcon: "home-work",

  BusinessCenterIcon: "business-center",

  StraightenIcon: "straighten",

  CropFreeIcon: "crop-free",

  EditIcon: "edit",

  OpenInNewIcon: "open-in-new",

  RefreshIcon: "refresh",

  MoreHorizIcon: "more-horiz",

  MoreVertIcon: "more-vert",

  CheckIcon: "check",

  WarningIcon: "warning",

  ErrorIcon: "error",

  InfoIcon: "info",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialIcons>["name"]
>;

/* =============================================================================
   MATERIAL COMMUNITY ICONS
   Specialized architectural and system icons.
============================================================================= */

export const COMMUNITY_ICONS = {
  FloorPlanIcon: "floor-plan",

  BlueprintIcon: "newspaper",

  RulerIcon: "ruler",

  RulerSquareIcon: "ruler-square",

  WallIcon: "wall",

  DoorIcon: "door",

  DoorOpenIcon: "door-open",

  WindowIcon: "window-open-variant",

  HomeModernIcon: "home-modern",

  OfficeBuildingIcon: "office-building",

  CubeScanIcon: "cube-scan",

  CubeOutlineIcon: "cube-outline",

  VectorSquareIcon: "vector-square",

  AxisArrowIcon: "axis-arrow",

  Rotate3DIcon: "rotate-3d",

  CameraIcon: "camera-outline",

  ImageFilterIcon: "image-filter-hdr-outline",

  FileCadIcon: "file-cad",

  FileDocumentIcon: "file-document-outline",

  FileDownloadIcon: "file-download-outline",

  FileUploadIcon: "file-upload-outline",

  CloudSyncIcon: "cloud-sync-outline",

  DatabaseIcon: "database-outline",

  ServerIcon: "server-outline",

  LightningBoltIcon: "lightning-bolt",

  ProgressCheckIcon: "progress-check",

  ProgressClockIcon: "progress-clock",

  CheckCircleIcon: "check-circle-outline",

  AlertCircleIcon: "alert-circle-outline",

  InformationIcon: "information-outline",

  AccountIcon: "account-outline",

  AccountGroupIcon: "account-group-outline",

  AccountMultipleIcon: "account-multiple-outline",

  BriefcaseIcon: "briefcase-outline",

  ChartLineIcon: "chart-line",

  ChartBoxIcon: "chart-box-outline",

  FolderMultipleIcon: "folder-multiple-outline",

  FolderPlusIcon: "folder-plus-outline",

  CogIcon: "cog-outline",

  ShieldIcon: "shield-outline",

  ShieldCheckIcon: "shield-check-outline",

  HelpCircleIcon: "help-circle-outline",

  MagnifyIcon: "magnify",

  FilterIcon: "filter-variant",

  SortIcon: "sort",

  DotsHorizontalIcon: "dots-horizontal",

  DotsVerticalIcon: "dots-vertical",

  ArrowRightIcon: "arrow-right",

  ArrowLeftIcon: "arrow-left",

  ArrowUpIcon: "arrow-up",

  ArrowDownIcon: "arrow-down",

  HeartOutlineIcon: "cards-heart-outline",
} as const satisfies Record<
  string,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;

/* =============================================================================
   ANT DESIGN
   Actions and utility icons.
============================================================================= */

export const ANT_DESIGN_ICONS = {
  SunIcon: "sun",
  StarIcon: "star",

  HeartIcon: "heart",

  UserIcon: "user",
  TeamIcon: "team",

  InfoCircleIcon: "info-circle",
  QuestionCircleIcon: "question-circle",

  CheckIcon: "check-circle",

  CloseIcon: "close-circle",

  PlusIcon: "plus-circle",

  EditIcon: "edit",

  DeleteIcon: "delete",

  SettingIcon: "setting",

  SearchIcon: "search",

  FilterIcon: "filter",

  DownloadIcon: "download",

  UploadIcon: "upload",

  ShareIcon: "share-alt",

  ArrowLeftIcon: "arrow-left",
  ArrowRightIcon: "arrow-right",

  MoreIcon: "ellipsis",
} as const satisfies Record<
  string,
  ComponentProps<typeof AntDesignIcon>["name"]
>;

/* =============================================================================
   FONT AWESOME 6
   Business and account icons.
============================================================================= */

export const FONT_AWESOME_6_ICONS = {
  ClockIcon: "clock",

  CalendarIcon: "calendar",

  UserIcon: "user",

  UserGroupIcon: "user-group",

  BuildingIcon: "building",

  HouseIcon: "house",

  FolderIcon: "folder",

  FileIcon: "file",

  CloudIcon: "cloud",

  DatabaseIcon: "database",

  GearIcon: "gear",

  ShieldIcon: "shield",

  LockIcon: "lock",

  UnlockIcon: "unlock",

  ChartIcon: "chart-line",

  ChartBarIcon: "chart-column",

  CreditCardIcon: "credit-card",

  WalletIcon: "wallet",

  CoinsIcon: "coins",

  PaperclipIcon: "paperclip",

  ArrowRightIcon: "arrow-right",

  ArrowLeftIcon: "arrow-left",

  ArrowUpIcon: "arrow-up",

  ArrowDownIcon: "arrow-down",

  LogoutIcon: "right-from-bracket",

  BusinessTimeIcon: "business-time",

  LocationDotIcon: "location-dot",
} as const satisfies Record<
  string,
  ComponentProps<typeof FontAwesome6>["name"]
>;

/* =============================================================================
   OCTICONS
============================================================================= */

export const OCTICONS = {
  LawIcon: "law",

  CheckIcon: "check",

  IssueOpenedIcon: "issue-opened",

  GitBranchIcon: "git-branch",

  GitPullRequestIcon: "git-pull-request",

  RepoIcon: "repo",

  OrganizationIcon: "organization",
} as const satisfies Record<string, ComponentProps<typeof Octicons>["name"]>;

/* =============================================================================
   ICON NAME
============================================================================= */

export type IconName =
  | keyof typeof IONICONS
  | keyof typeof MATERIAL_ICONS
  | keyof typeof COMMUNITY_ICONS
  | keyof typeof ANT_DESIGN_ICONS
  | keyof typeof FONT_AWESOME_6_ICONS
  | keyof typeof OCTICONS;

/* =============================================================================
   ICON PROPS
============================================================================= */

export interface IconSymbolProps {
  name: IconName;

  size?: number;

  color: string | OpaqueColorValue;

  style?: StyleProp<TextStyle>;

  /**
   * Accessibility label for icons that communicate meaning.
   */
  accessibilityLabel?: string;
}

/* =============================================================================
   ICON REGISTRY
============================================================================= */

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  accessibilityLabel,
}: IconSymbolProps) {
  /* -------------------------------------------------------------------------
       Ionicons
       ------------------------------------------------------------------------- */

  if (name in IONICONS) {
    return (
      <Ionicons
        name={IONICONS[name as keyof typeof IONICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  /* -------------------------------------------------------------------------
       Material Icons
       ------------------------------------------------------------------------- */

  if (name in MATERIAL_ICONS) {
    return (
      <MaterialIcons
        name={MATERIAL_ICONS[name as keyof typeof MATERIAL_ICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  /* -------------------------------------------------------------------------
       Material Community Icons
       ------------------------------------------------------------------------- */

  if (name in COMMUNITY_ICONS) {
    return (
      <MaterialCommunityIcons
        name={COMMUNITY_ICONS[name as keyof typeof COMMUNITY_ICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  /* -------------------------------------------------------------------------
       Ant Design
       ------------------------------------------------------------------------- */

  if (name in ANT_DESIGN_ICONS) {
    return (
      <AntDesignIcon
        name={ANT_DESIGN_ICONS[name as keyof typeof ANT_DESIGN_ICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  /* -------------------------------------------------------------------------
       Font Awesome 6
       ------------------------------------------------------------------------- */

  if (name in FONT_AWESOME_6_ICONS) {
    return (
      <FontAwesome6
        name={FONT_AWESOME_6_ICONS[name as keyof typeof FONT_AWESOME_6_ICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  /* -------------------------------------------------------------------------
       Octicons
       ------------------------------------------------------------------------- */

  if (name in OCTICONS) {
    return (
      <Octicons
        name={OCTICONS[name as keyof typeof OCTICONS]}
        size={size}
        color={color}
        style={style}
        accessibilityLabel={accessibilityLabel}
      />
    );
  }

  return null;
}
