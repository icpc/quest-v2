import React from "react";

import { getSettings } from "../utils/requests";

const Rules = () => {
  const [rulesHtml, setRulesHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    getSettings().then((s) => setRulesHtml(s.rules || ""));
  }, []);

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
