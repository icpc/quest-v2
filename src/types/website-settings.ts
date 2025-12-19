import { WebsiteSettingsAuthOptions } from "@/types/pocketbase-types";

export type WebsiteSettingsData = {
  auth: WebsiteSettingsAuthOptions[];
  logo?: string;
  name: string;
  rules?: string;
};
