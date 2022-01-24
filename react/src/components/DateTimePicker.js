import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker as MUIDateTimePicker } from '@mui/lab';
import { TextField } from '@mui/material';

const DateTimePicker = (props) => {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MUIDateTimePicker
        renderInput={(props) => <TextField {...props} />}
        label={props.label}
        value={props.value}
        inputFormat="DD/MM/yyyy hh:mm a"
        onChange={(newValue) => props.onChange(newValue)}
      />
    </LocalizationProvider>
  );
};

export default DateTimePicker;
