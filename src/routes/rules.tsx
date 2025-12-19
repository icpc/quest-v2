import { createFileRoute } from "@tanstack/react-router";

import Rules from "@/features/rules/Rules";

export const Route = createFileRoute("/rules")({
  component: Rules,
});
