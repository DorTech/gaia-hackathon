import React from "react";
import { Box, Button, Stack } from "@mui/material";
import { Lever } from "../types";

interface LeverOptionsProps {
  lever: Lever;
  delta?: number;
  onPickOption: (leverId: string, delta: number) => void;
}

export const LeverOptions: React.FC<LeverOptionsProps> = ({
  lever,
  delta,
  onPickOption,
}) => {
  const isCurrentSelected = delta === undefined || delta === 0;

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
      <Button
        onClick={() => onPickOption(lever.id, 0)}
        sx={{
          padding: "5px 10px",
          borderRadius: "6px",
          border: "2px solid",
          fontSize: "0.69rem",
          fontWeight: 600,
          textTransform: "none",
          lineHeight: "1.3",
          transition: "all 0.2s ease",
          borderColor: isCurrentSelected ? "var(--orange)" : "var(--border2)",
          color: isCurrentSelected ? "white" : "var(--orange)",
          backgroundColor: isCurrentSelected
            ? "var(--orange)"
            : "var(--orange-l)",
          boxShadow: isCurrentSelected
            ? "0 0 8px rgba(232, 146, 58, 0.3)"
            : "none",
          "&:hover": {
            backgroundColor: isCurrentSelected
              ? "var(--orange)"
              : "var(--orange)",
            color: "white",
            borderColor: "var(--orange)",
          },
        }}
      >
        {lever.current}
      </Button>

      {lever.options.map((opt, idx) => {
        const isSelected = delta === opt.delta;
        return (
          <Button
            key={idx}
            onClick={() => onPickOption(lever.id, opt.delta)}
            sx={{
              padding: "5px 10px",
              borderRadius: "6px",
              border: "2px solid",
              fontSize: "0.69rem",
              fontWeight: 600,
              textTransform: "none",
              lineHeight: "1.3",
              transition: "all 0.2s ease",
              borderColor: isSelected ? "var(--green)" : "var(--border2)",
              color: isSelected ? "white" : "var(--text2)",
              backgroundColor: isSelected ? "var(--green)" : "white",
              boxShadow: isSelected
                ? "0 0 8px rgba(122, 229, 140, 0.3)"
                : "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              "&:hover": {
                borderColor: "var(--green)",
                color: isSelected ? "white" : "var(--green-d)",
                backgroundColor: isSelected ? "var(--green)" : "#f5f7fa",
              },
            }}
          >
            {opt.label}
            {opt.isReference && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "inherit",
                }}
              >
                ★
              </Box>
            )}
          </Button>
        );
      })}
    </Stack>
  );
};
