import React from "react";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { Status } from "@/types/types";

interface Filters {
  userId?: string;
  questId?: string;
  status?: Status;
  page: number;
  perPage: number;
}

interface SubmissionFiltersProps {
  filters: Filters;
  onChange: (name: keyof Filters, value: string | undefined) => void;
  users: { id: string; name: string }[];
  quests: { id: string; name: string }[];
}

const statusOptions: Status[] = ["CORRECT", "WRONG", "PENDING"];

function SubmissionFilters({
  filters,
  onChange,
  users,
  quests,
}: SubmissionFiltersProps) {
  return (
    <Box display="flex" gap={2} mb={2}>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>User</InputLabel>
        <Select
          value={filters.userId}
          label="User"
          onChange={(e) => onChange("userId", e.target.value || undefined)}
        >
          <MenuItem value={undefined}>All</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Task</InputLabel>
        <Select
          value={filters.questId}
          label="Task"
          onChange={(e) => onChange("questId", e.target.value || undefined)}
        >
          <MenuItem value={undefined}>All</MenuItem>
          {quests.map((q) => (
            <MenuItem key={q.id} value={q.id}>
              {q.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status}
          label="Status"
          onChange={(e) => onChange("status", e.target.value || undefined)}
        >
          <MenuItem value={undefined}>All</MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default SubmissionFilters;
