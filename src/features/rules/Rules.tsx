import React from "react";

import { Container } from "@mui/material";
import { useLoaderData } from "@tanstack/react-router";

const Rules = () => {
  const { website_settings } = useLoaderData({ from: "__root__" });
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
