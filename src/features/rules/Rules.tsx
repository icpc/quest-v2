import React from "react";

import { Container } from "@mui/material";

import { useRouteContext } from "@tanstack/react-router";

const Rules = () => {
  const { website_settings } = useRouteContext({ from: "__root__" });
  const rulesHtml = website_settings.rules;

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
