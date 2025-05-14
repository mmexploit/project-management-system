import {
  IconGauge,
  IconCalendarEvent,
  IconHeartHandshake,
  IconNews,
  IconSpeakerphone,
  IconUsers,
  IconSettings,
  IconLogout,
  IconSchool,
  IconCamper,
  IconBuilding,
  IconBuildingFortress,
  IconBuildings,
  IconFolder,
  IconCamera,
  IconPhotoPlus,
  IconBriefcase,
  IconCertificate,
  IconPhoneCall,
  IconAmbulance,
  IconPhoneCalling,
  IconUser,
  IconPaperBag,
  IconWallpaper,
  IconRobot,
  IconBaselineDensityMedium,
  IconListDetails,
  IconNumber,
  IconNotebook,
  IconFlag3,
  IconMail,
} from "@tabler/icons-react";
import { Roles } from "./roles";

export const menu = {
  mainMenu: [
    {
      label: "Projects",
      icon: IconGauge,
      link: "/projects",
      permissions: ["user", "admin"],
    },
    {
      label: "Users",
      icon: IconUsers,
      link: "/users",
      permissions: ["admin"],
    },
  ],
  Others: [
    {
      label: "Log Out",
      icon: IconLogout,
      link: "/auth/log-out",
      permissions: ["user", "admin"],
    },
  ],
};
