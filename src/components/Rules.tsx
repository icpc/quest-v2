import React from "react";

import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const Rules = () => {
  const { settings } = useWebsiteSettings();
  const rulesHtml = settings.rules;

  return (
    <div
      style={{
        margin: "10%",
      }}
    >
      <h1>Rules</h1>
      {rulesHtml ? (
        <div dangerouslySetInnerHTML={{ __html: rulesHtml }} />
      ) : (
        <>
          <p>Please add the rules to the settings in order to display them</p>
        </>
      )}
    </div>
  );
};

export default Rules;
