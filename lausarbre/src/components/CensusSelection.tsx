import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Paper, Button } from '@mui/material';

const CensusSelection: React.FC<{ onSelectYear: (year: number) => void }> = ({ onSelectYear }) => {
    const years = [1850, 1860, 1870];
    const [selectedYear, setSelectedYear] = useState<number | null>(null);

    const handleYearChange = (event: SelectChangeEvent<number>) => {
        const year = parseInt(event.target.value as string, 10);
        setSelectedYear(year);
    };

    const handleSubmit = () => {
        if (selectedYear !== null) {
            onSelectYear(selectedYear);
        }
    };

    return (
        <Box component={Paper} elevation={3} padding={3} marginY={2}>
            <Typography variant="h6" gutterBottom>
                Select a Census Year
            </Typography>
            <FormControl fullWidth variant="outlined">
                <InputLabel id="census-year-label">Year</InputLabel>
                <Select
                    labelId="census-year-label"
                    id="census-year-select"
                    value={selectedYear || ''}
                    onChange={handleYearChange}
                    label="Year"
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={selectedYear === null}>
                    View Census Table
                </Button>
            </Box>
        </Box>
    );
};

export default CensusSelection;


