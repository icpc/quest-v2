import { CircularProgress } from "@mui/material";

export default function RoutePending() {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <CircularProgress />
    </div>
  );
}
