import * as React from 'react';
import { Autocomplete, createFilterOptions, TextField } from '@mui/material';

interface SelectFeatureComponentProps {
  label: string;
  default_val: string;
  categoryOptions: string[];
  onChange: (value: string) => void;
  column_info;
}

export function SelectFeatureComponent({ label, default_val, categoryOptions, onChange, column_info }: SelectFeatureComponentProps) {
  let autocomplete_options = [];
  let autocomplete_filterOptions = null;
  if (categoryOptions != null) {
    autocomplete_options = autocomplete_options.concat(
      categoryOptions.map((attribute) => {
        let group = null;
        if (column_info != null && attribute in column_info) {
          group = column_info[attribute].featureLabel;
        }
        return {
          value: attribute,
          group,
        };
      }),
    );
    autocomplete_filterOptions = createFilterOptions({
      stringify: (option: any) => {
        return option.group + option.value;
      },
    });
  }

  return (
    <Autocomplete
      filterOptions={autocomplete_filterOptions}
      onChange={(event, newValue) => {
        onChange((newValue as any)?.value ?? null);
      }}
      options={autocomplete_options.sort((a, b) => {
        if (a.group === b.group) {
          return -b.value.localeCompare(a.value);
        }
        return -b.group.localeCompare(a.group);
      })}
      size="small"
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.value}
      isOptionEqualToValue={(option: any, value) => {
        return option.value === value?.value;
      }}
      value={autocomplete_options.find((option) => option.value === default_val) ?? null}
      renderInput={(params) => <TextField {...params} label={`${label} by`} />}
    />
  );
}
