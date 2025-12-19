import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";

import SubmissionFilters from "@/features/validation/components/SubmissionFilters";
import { downloadLeaderboardCsv } from "@/features/validation/utils/downloadLeaderboardCsv";
import { downloadSubmissionsCsv } from "@/features/validation/utils/downloadSubmissionsCsv";
import { ValidatedSubmissionsListResult } from "@/types/types";
import {
  getValidatedSubmissions,
  setValidatedSubmissionStatus,
} from "@/utils/requests";

export type Status = "CORRECT" | "WRONG" | "PENDING";

function ValidateSubmissions() {
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] =
    useState<ValidatedSubmissionsListResult>({ items: [], totalItems: 0 });
  const [filters, setFilters] = useState<{
    userId?: string;
    questId?: string;
    status?: Status;
    page: number;
    perPage: number;
  }>({ page: 1, perPage: 50, status: "PENDING" });

  // Fetch submissions
  useEffect(() => {
    (async () => {
      setLoading(true);
      setSubmissions(await getValidatedSubmissions(filters));
      setLoading(false);
    })();
  }, [filters]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setFilters((prev) => ({ ...prev, page: newPage + 1 })); // TablePagination is 0-based
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFilters((prev) => ({
      ...prev,
      perPage: parseInt(event.target.value, 10),
      page: 1,
    }));
  };

  const handleDecision = async (
    submissionId: string,
    success: boolean | "clear",
  ) => {
    setLoading(true);
    await setValidatedSubmissionStatus(submissionId, success);
    setFilters((prev) => ({ ...prev })); // trigger refresh
    setLoading(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h4" gutterBottom>
          Validate Submissions
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={() => downloadSubmissionsCsv()}>
            Download Submissions CSV
          </Button>
          <Button variant="outlined" onClick={() => downloadLeaderboardCsv()}>
            Download Leaderboard CSV
          </Button>
        </Stack>
      </Box>
      <SubmissionFilters filters={filters} setFilters={setFilters} />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Task</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted At</TableCell>
                <TableCell>Text/Attachment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.items.map((row) => (
                <TableRow
                  key={row.id}
                  sx={
                    row.status === "CORRECT"
                      ? { backgroundColor: "#e6f4ea" } // pale green
                      : row.status === "WRONG"
                        ? { backgroundColor: "#fdeaea" } // pale red
                        : undefined
                  }
                >
                  <TableCell>{row.userName}</TableCell>
                  <TableCell>
                    <RouterLink
                      to="/quest-details/$questId"
                      params={{ questId: row.questId }}
                      style={{ textDecoration: "underline" }}
                    >
                      {row.questName}
                    </RouterLink>
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <div>{row.text}</div>
                      {row.url ? (
                        <a href={row.url} target="_blank" rel="noreferrer">
                          Attachment
                        </a>
                      ) : (
                        <div />
                      )}
                    </Stack>
                  </TableCell>
                  {row.status === "PENDING" ? (
                    <TableCell>
                      <Stack gap={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleDecision(row.id, true)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDecision(row.id, false)}
                        >
                          Deny
                        </Button>
                      </Stack>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleDecision(row.id, "clear")}
                        sx={{ mr: 1 }}
                      >
                        Clear
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        component="div"
        count={submissions.totalItems}
        page={filters.page - 1}
        onPageChange={handlePageChange}
        rowsPerPage={filters.perPage}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[50, 500]}
      />
    </Container>
  );
}

export default ValidateSubmissions;
