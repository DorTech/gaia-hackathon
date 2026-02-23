import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { LeversListProps } from "../types";
import { LeverCard } from "./LeverCard";

export const LeversList: React.FC<LeversListProps> = ({
  levers,
  deltas,
  onPickOption,
}) => {
  return (
    <Box>
      <Stack spacing={1}>
        {levers.map((lever) => (
          <LeverCard
            key={lever.id}
            lever={lever}
            delta={deltas[lever.id]}
            onPickOption={onPickOption}
          />
        ))}
      </Stack>
    </Box>
  );
};
