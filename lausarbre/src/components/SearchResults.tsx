import React from 'react';
import { Person } from '../App';
import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box
} from '@mui/material';

type Props = {
    results: Person[];
    onSelectPerson: (p: Person) => void;
};

const SearchResults: React.FC<Props> = ({ results, onSelectPerson }) => {
    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                Select a Person
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Surname</TableCell>
                            <TableCell>Occupation</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {results.map((person, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{person.name}</TableCell>
                                <TableCell>{person.surname}</TableCell>
                                <TableCell>{person.occupation}</TableCell>
                                <TableCell>{person.location}</TableCell>
                                <TableCell>{person.year}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => onSelectPerson(person)}>
                                        View Tree
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SearchResults;
