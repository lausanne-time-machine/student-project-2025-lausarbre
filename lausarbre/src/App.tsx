import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Stack, Box } from '@mui/material';
import CensusSelection from './components/CensusSelection';
import CensusTable from './components/CensusTable';
import FamilyTree from './components/FamilyTree';
import SearchResults from './components/SearchResults';

export type Person = {
  name: string;
  surname: string;
  occupation: string;
  year?: string;
  location?: string;
};

function App() {
  const [page, setPage] = useState<'landing' | 'census' | 'table' | 'results' | 'tree'>('landing');
  const [year, setYear] = useState<string>('');
  const [person, setPerson] = useState<Person | null>(null);
  const [searchData, setSearchData] = useState<Partial<Person>>({});
  const [searchResults, setSearchResults] = useState<Person[]>([]);

  const hardcodedPeople: Person[] = [
    { name: 'Marie', surname: 'Curie', occupation: 'Scientist', year: '1860', location: 'Lausanne' },
    { name: 'Jean', surname: 'Dupont', occupation: 'Blacksmith', year: '1850', location: 'Lausanne' },
    { name: 'Jean', surname: 'Dupont', occupation: 'Miller', year: '1870', location: 'Ouchy' },
    { name: 'Louis', surname: 'Pasteur', occupation: 'Chemist', year: '1870', location: 'Lausanne' },
  ];

  const handleSearch = () => {
    const results = hardcodedPeople.filter(p => {
      return (
        (!searchData.name || p.name.toLowerCase().includes(searchData.name.toLowerCase())) &&
        (!searchData.surname || p.surname.toLowerCase().includes(searchData.surname.toLowerCase())) &&
        (!searchData.occupation || p.occupation.toLowerCase().includes(searchData.occupation.toLowerCase())) &&
        (!searchData.year || p.year === searchData.year) &&
        (!searchData.location || p.location?.toLowerCase().includes(searchData.location.toLowerCase()))
      );
    });

    if (results.length > 0) {
      setSearchResults(results);
      setPage('results');
    } else {
      alert('No matches found.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 6 }}>
      {page === 'landing' && (
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>Family Tree Explorer</Typography>
          <Stack spacing={2} alignItems="center">
            <TextField fullWidth label="First Name" variant="outlined" onChange={(e) => setSearchData({ ...searchData, name: e.target.value })} />
            <TextField fullWidth label="Last Name" variant="outlined" onChange={(e) => setSearchData({ ...searchData, surname: e.target.value })} />
            <TextField fullWidth label="Occupation" variant="outlined" onChange={(e) => setSearchData({ ...searchData, occupation: e.target.value })} />
            <TextField fullWidth label="Location" variant="outlined" onChange={(e) => setSearchData({ ...searchData, location: e.target.value })} />
            <TextField fullWidth label="Year" variant="outlined" onChange={(e) => setSearchData({ ...searchData, year: e.target.value })} />

            <Button variant="contained" color="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => setPage('census')}>
              Browse Census Records
            </Button>
          </Stack>
        </Box>
      )}

      {page === 'census' && (
        <CensusSelection onSelectYear={(year: number) => { setYear(year.toString()); setPage('table'); }} />
      )}

      {page === 'table' && (
        <CensusTable 
          year={parseInt(year, 10)} 
          onBack={() => setPage('landing')} 
          onSelectPerson={(p) => { setPerson(p); setPage('tree'); }} 
        />
      )}

      {page === 'results' && (
        <SearchResults results={searchResults} onSelectPerson={(p) => { setPerson(p); setPage('tree'); }} />
      )}

      {page === 'tree' && person && (
        <Box>
          <Button variant="text" onClick={() => { setPage('landing'); setPerson(null); }}>
            ← Back to Home
          </Button>
          <FamilyTree person={person} />
        </Box>
      )}
    </Container>
  );
}

export default App;

