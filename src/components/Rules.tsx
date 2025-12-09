import React from "react";

import { Container } from "@mui/material";

import { useWebsiteSettings } from "../hooks/useWebsiteSettings";

const Rules = () => {
  const { settings } = useWebsiteSettings();
  const rulesHtml = settings.rules;

  return (
    <Container>
      <h1>Rules</h1>
      {rulesHtml ? (
        <div dangerouslySetInnerHTML={{ __html: rulesHtml }} />
      ) : null}
    </Container>
  );
};

export default Rules;
