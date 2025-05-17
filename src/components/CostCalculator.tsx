/*  …all existing imports …  */
import { MenuItem, TextField } from "@mui/material";   // NEW

/* inside <Grid container> … replace the old currency ToggleButton block */
<Grid item xs={12}>
  <Typography gutterBottom>Currency</Typography>
  <Controller
    name="currency"
    control={control}
    render={({ field }) => (
      <TextField
        select
        fullWidth
        {...field}
        onChange={(e) => field.onChange(e.target.value as Currency)}
      >
        {["EUR", "USD", "DKK", "GBP", "SEK", "NOK"].map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>
    )}
  />
</Grid>
