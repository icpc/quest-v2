import React from "react";

import { createFileRoute, useRouter } from "@tanstack/react-router";

import RoutePending from "@/components/RoutePending";
import ValidateSubmissions from "@/features/validation/ValidateSubmissions";
import {
  Collections,
  QuestsRecord,
  SubmissionsRecord,
  UsersRecord,
  ValidatedSubmissionsResponse,
} from "@/types/pocketbase-types";
import { Status, ValidatedSubmissionsListResult } from "@/types/types";
import pb from "@/utils/pocketbase";

type ValidationFilters = {
  userId?: string;
  questId?: string;
  status?: Status;
  page: number;
  perPage: number;
};

const defaultFilters: ValidationFilters = {
  page: 1,
  perPage: 50,
  status: "PENDING",
};

let currentFilters: ValidationFilters = { ...defaultFilters };

export const Route = createFileRoute("/_auth/validate")({
  loader: async () => {
    const filterArr = [];
    if (currentFilters.userId) {
      filterArr.push(`submitter = "${currentFilters.userId}"`);
    }
    if (currentFilters.questId) {
      filterArr.push(`quest = "${currentFilters.questId}"`);
    }
    if (currentFilters.status) {
      filterArr.push(`status = "${currentFilters.status}"`);
    }
    const filter = filterArr.join(" && ");

    const [result, users, quests] = await Promise.all([
      pb.collection(Collections.ValidatedSubmissions).getList<
        ValidatedSubmissionsResponse<
          Status,
          {
            submission: SubmissionsRecord;
            quest: QuestsRecord;
            submitter: UsersRecord;
          }
        >
      >(currentFilters.page, currentFilters.perPage, {
        filter: filter || undefined,
        expand: "submission,submitter,quest",
        fields:
          "*,expand.submission.*,expand.submitter.*,expand.quest.id,expand.quest.name,",
      }),
      pb
        .collection(Collections.Users)
        .getFullList<UsersRecord>({ fields: "id,name" }),
      pb
        .collection(Collections.Quests)
        .getFullList<QuestsRecord>({ fields: "id,name" }),
    ]);

    const fileToken = await pb.files.getToken();
    const submissions: ValidatedSubmissionsListResult = {
      items: result.items.map((row) => {
        let text: string | undefined = undefined;
        let url: string | undefined = undefined;
        const submission = row.expand?.submission;
        if (submission) {
          text = submission.text;
          if (submission.attachment) {
            url = pb.files.getURL(submission, submission.attachment, {
              token: fileToken,
            });
          }
        }
        return {
          id: row.id,
          userId: row.expand.submitter.id,
          userName: row.expand.submitter.name!,
          questId: row.expand.quest.id,
          questName: row.expand.quest.name,
          status: row.status as Status,
          createdAt: submission?.created,
          text,
          url,
        };
      }),
      totalItems: result.totalItems,
    };

    return {
      submissions,
      users: users.map((u) => ({ id: u.id, name: u.name || "(no name)" })),
      quests: quests.map((q) => ({ id: q.id, name: q.name })),
    };
  },
  pendingComponent: RoutePending,
  component: ValidateRoute,
});

function ValidateRoute() {
  const router = useRouter();
  const { submissions, users, quests } = Route.useLoaderData();
  const [filters, setFilters] =
    React.useState<ValidationFilters>(currentFilters);

  React.useEffect(() => {
    return () => {
      currentFilters = { ...defaultFilters };
    };
  }, []);

  const handleFiltersChange = (nextFilters: ValidationFilters) => {
    currentFilters = nextFilters;
    setFilters(nextFilters);
    router.invalidate();
  };

  return (
    <ValidateSubmissions
      submissions={submissions}
      users={users}
      quests={quests}
      filters={filters}
      onFiltersChange={handleFiltersChange}
    />
  );
}
