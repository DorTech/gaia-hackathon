import React, { useEffect, useState } from 'react';
import { FilterSelectMUI } from '../../components/FilterSelectMUI';

import type { BenchmarkFiltersState } from '../../types/benchmark';
export type { BenchmarkFiltersState };

interface BenchmarkFiltersProps {
  initialValues: BenchmarkFiltersState;
  onApply: (values: BenchmarkFiltersState) => void;
  options: {
    species: string[];
    department: string[];
    agricultureType: string[];
    iftThreshold: string[];
  };
}

export const BenchmarkFilters: React.FC<BenchmarkFiltersProps> = ({
  initialValues,
  onApply,
  options,
}) => {
  const [species, setSpecies] = useState(initialValues.species);
  const [department, setDepartment] = useState(initialValues.department);
  const [agricultureType, setAgricultureType] = useState(initialValues.agricultureType);
  const [iftThreshold, setIftThreshold] = useState(initialValues.iftThreshold);

  useEffect(() => {
    setSpecies(initialValues.species);
    setDepartment(initialValues.department);
    setAgricultureType(initialValues.agricultureType);
    setIftThreshold(initialValues.iftThreshold);
  }, [initialValues]);

  const handleApply = () => {
    onApply({
      species,
      department,
      agricultureType,
      iftThreshold,
    });
  };

  return (
    <div className="filters">
      <FilterSelectMUI
        label="🌾 Espèce cultivée"
        ariaLabel="Espèce cultivée"
        value={species}
        onChange={setSpecies}
        options={options.species}
        placeholder="Choisir une espèce"
      />
      <FilterSelectMUI
        label="📍 Département"
        ariaLabel="Département"
        value={department}
        onChange={setDepartment}
        options={options.department}
        placeholder="Choisir un département"
      />
      <FilterSelectMUI
        label="🌿 Type agriculture"
        ariaLabel="Type agriculture"
        value={agricultureType}
        onChange={setAgricultureType}
        options={options.agricultureType}
        placeholder="Choisir un type"
      />
      <div className="fg-sep"></div>
      <FilterSelectMUI
        label="🎯 Seuil de performance IFT"
        ariaLabel="Seuil de performance IFT"
        value={iftThreshold}
        onChange={setIftThreshold}
        options={options.iftThreshold}
        placeholder="Choisir un seuil"
      />
      <button className="btn btn-green" onClick={handleApply} style={{ height: '40px' }}>
        Appliquer
      </button>
    </div>
  );
};
