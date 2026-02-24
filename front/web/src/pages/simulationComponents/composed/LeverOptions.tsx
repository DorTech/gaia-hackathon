import React, { useState, useEffect } from "react";
import { Box, Button, Slider, Stack, Typography } from "@mui/material";
import { Lever } from "../types";
import type { ITKFormState } from "../../../store/diagnosticAtoms";

interface LeverOptionsProps {
  lever: Lever;
  activeOverrides?: Partial<ITKFormState>;
  onPickOption: (leverId: string, overrides: Partial<ITKFormState> | null) => void;
}

export const LeverOptions: React.FC<LeverOptionsProps> = ({
  lever,
  activeOverrides,
  onPickOption,
}) => {
  const s = lever.slider;

  // Slider mode for quantitative levers
  if (s) {
    const currentSliderValue = (activeOverrides?.[s.formKey] as number) ?? s.currentValue;
    const [sliderValue, setSliderValue] = useState(currentSliderValue);

    // Reset slider when current value changes (diagnostic form update)
    useEffect(() => {
      if (!activeOverrides) {
        setSliderValue(s.currentValue);
      }
    }, [s.currentValue, activeOverrides]);

    const handleSliderChange = (_: unknown, value: number | number[]) => {
      const v = Array.isArray(value) ? value[0] : value;
      setSliderValue(v);
      if (v === s.currentValue) {
        onPickOption(lever.id, null);
      } else {
        onPickOption(lever.id, { [s.formKey]: v });
      }
    };

    const isActive = !!activeOverrides;

    // Reference marker position as percentage
    const refPct = ((s.referenceValue - s.min) / (s.max - s.min)) * 100;

    return (
      <Box sx={{ width: "100%", px: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ fontSize: "0.67rem", color: "var(--text3)" }}>
            {s.min} {s.unit}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: 800,
              color: isActive ? "var(--green-d)" : "var(--orange)",
            }}
          >
            {sliderValue} {s.unit}
          </Typography>
          <Typography sx={{ fontSize: "0.67rem", color: "var(--text3)" }}>
            {s.max} {s.unit}
          </Typography>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Slider
            min={s.min}
            max={s.max}
            value={sliderValue}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v} ${s.unit}`}
            size="small"
            sx={{
              color: isActive ? "var(--green)" : "var(--orange)",
              "& .MuiSlider-rail": {
                opacity: 1,
                backgroundColor: "var(--border2)",
              },
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 14,
                height: 14,
                backgroundColor: "var(--white)",
                border: `2px solid ${isActive ? "var(--green)" : "var(--orange)"}`,
              },
            }}
          />
          {/* Reference marker */}
          <Box
            sx={{
              position: "absolute",
              left: `${refPct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "2px",
              height: "16px",
              backgroundColor: "var(--green-d)",
              opacity: 0.6,
              pointerEvents: "none",
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: "0.62rem",
            color: "var(--green-d)",
            fontWeight: 600,
            mt: -0.5,
          }}
        >
          Ref: {s.referenceLabel}
        </Typography>
      </Box>
    );
  }

  // Button mode for qualitative levers
  const isCurrentSelected = !activeOverrides;

  const isOptionSelected = (optOverrides: Partial<ITKFormState>) => {
    if (!activeOverrides) return false;
    return Object.entries(optOverrides).every(
      ([k, v]) => activeOverrides[k as keyof ITKFormState] === v
    );
  };

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
      <Button
        onClick={() => onPickOption(lever.id, null)}
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
        const isSelected = isOptionSelected(opt.formOverrides);
        return (
          <Button
            key={idx}
            onClick={() => onPickOption(lever.id, opt.formOverrides)}
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
