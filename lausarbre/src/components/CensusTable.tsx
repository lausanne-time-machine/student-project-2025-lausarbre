import React from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography } from '@mui/material';

type Props = {
    year: number;
    onBack: () => void;
    onSelectPerson: (p: any) => void;
};

const CensusTable: React.FC<Props> = ({ year, onBack }) => {
    // Example hardcoded data
    const data = [
        { name: 'John Doe', occupation: 'Farmer', location: 'Lausanne', year: 1850 },
        { name: 'Jane Smith', occupation: 'Teacher', location: 'Lausanne', year: 1850 },
        { name: 'Pierre Dubois', occupation: 'Merchant', location: 'Lausanne', year: 1850 },
    ];

    return (
        <Box component={Paper} elevation={3} padding={3} marginY={2}>
            <Typography variant="h6" gutterBottom>
                Census Records for {year}
            </Typography>
            <TableContainer component={Paper} elevation={1} sx={{ marginTop: 2 }}>
                <Table aria-label="census table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Occupation</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Year</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.occupation}</TableCell>
                                <TableCell>{row.location}</TableCell>
                                <TableCell>{row.year}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-start" marginTop={2}>
                <Button variant="contained" color="secondary" onClick={onBack}>
                    Back
                </Button>
            </Box>
        </Box>
    );
};

export default CensusTable;
