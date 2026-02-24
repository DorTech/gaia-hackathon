import React from "react";
import { Box, Typography } from "@mui/material";
import { SummaryRefItemProps } from "../types";

export const SummaryRefItem: React.FC<SummaryRefItemProps> = ({
  label,
  value,
  color,
}) => {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography
        sx={{
          fontSize: "0.62rem",
          color: "var(--text2)",
          fontWeight: 600,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "1.45rem",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: color || "var(--text2)",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
