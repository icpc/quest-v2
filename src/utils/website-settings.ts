import defaultLogo from "@/assets/logo.svg";
import {
  Collections,
  WebsiteSettingsAuthOptions,
} from "@/types/pocketbase-types";
import { WebsiteSettingsData } from "@/types/website-settings";

import pb from "./pocketbase";

const INITIAL_SETTINGS: WebsiteSettingsData = {
  auth: [],
  name: "",
};

const FALLBACK_SETTINGS: WebsiteSettingsData = {
  ...INITIAL_SETTINGS,
  auth: [WebsiteSettingsAuthOptions.PASSWORD],
  logo: defaultLogo,
  name: "Quest",
  rules: "Please add the rules to the settings in order to display them here.",
};

export async function loadWebsiteSettings(): Promise<WebsiteSettingsData> {
  try {
    const record = await pb
      .collection(Collections.WebsiteSettings)
      .getFirstListItem("");
    return {
      auth: record.auth?.length ? record.auth : FALLBACK_SETTINGS.auth,
      logo: record.logo?.trim()
        ? pb.files.getURL(record, record.logo)
        : FALLBACK_SETTINGS.logo,
      name: record.name?.trim() || FALLBACK_SETTINGS.name,
      rules: record.rules || FALLBACK_SETTINGS.rules,
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return FALLBACK_SETTINGS;
  }
}
