import React, { useEffect, useState } from "react";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { Status } from "../types/types";
import { getUsersAndQuestsForFilters } from "../utils/requests";

interface Filters {
  userId?: string;
  questId?: string;
  status?: Status;
  page: number;
  perPage: number;
}

interface SubmissionFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const statusOptions: Status[] = ["CORRECT", "WRONG", "PENDING"];

function SubmissionFilters({ filters, setFilters }: SubmissionFiltersProps) {
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [quests, setQuests] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsersAndQuestsForFilters().then(({ users, quests }) => {
      setUsers(users);
      setQuests(quests);
      setLoading(false);
    });
  }, []);

  const handleChange = (name: keyof Filters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [name]: value || undefined, page: 1 }));
  };

  return (
    <Box display="flex" gap={2} mb={2}>
      <FormControl size="small" sx={{ minWidth: 180 }} disabled={loading}>
        <InputLabel>User</InputLabel>
        <Select
          value={filters.userId}
          label="User"
          onChange={(e) => handleChange("userId", e.target.value || undefined)}
        >
          <MenuItem value={undefined}>All</MenuItem>
          {users.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              {u.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 180 }} disabled={loading}>
        <InputLabel>Task</InputLabel>
        <Select
          value={filters.questId}
          label="Task"
          onChange={(e) => handleChange("questId", e.target.value || undefined)}
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
          onChange={(e) => handleChange("status", e.target.value || undefined)}
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
