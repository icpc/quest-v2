import * as React from "react";

import defaultLogo from "../assets/logo.svg";
import { WebsiteSettingsAuthOptions } from "../types/pocketbase-types";
import { WebsiteSettingsData, getWebsiteSettings } from "../utils/requests";

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

export const useWebsiteSettings = () => {
  const [settings, setSettings] =
    React.useState<WebsiteSettingsData>(INITIAL_SETTINGS);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    getWebsiteSettings()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        if (data) {
          setSettings({
            auth: data.auth.length ? data.auth : FALLBACK_SETTINGS.auth,
            logo: data.logo?.trim() || FALLBACK_SETTINGS.logo,
            name: data.name?.trim() || FALLBACK_SETTINGS.name,
            rules: data.rules || FALLBACK_SETTINGS.rules,
          });
        }
      })
      .catch(() => {
        /* swallow - defaults remain */
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading } as const;
};
