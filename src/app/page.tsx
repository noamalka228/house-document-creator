'use client';
import { useState } from 'react';
import {
  Container, Typography, Box, Button, MenuItem, Select,
  InputLabel, FormControl, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress
} from '@mui/material';

const SUPPORTED_DOC_TYPES = [
  { value: 'bill', label: 'Bill' },
  { value: 'price_proposal', label: 'Price Proposal' }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file || !docType) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      alert(`Error extracting text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!result?.csvData) return;
    const csvContent = `${result.csvHead}\n${result.csvData}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" align="center" color="primary">
        House Document Creator
      </Typography>

      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Document</Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={docType || ''}
              label="Document Type"
              onChange={(e) => setDocType(e.target.value)}
            >
              {SUPPORTED_DOC_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="outlined" component="label" fullWidth size="large">
            {file ? file.name : "Choose Image (Hebrew text supported)"}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>

          <Button
            variant="contained"
            size="large"
            onClick={handleExtract}
            disabled={!file || !docType || loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Extract to CSV'}
          </Button>
        </Box>
      </Paper>

      {result && result.document && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Extracted Data</Typography>
            <Button variant="contained" color="secondary" onClick={downloadCSV}>
              Download CSV
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Field</strong></TableCell>
                  <TableCell><strong>Value</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(result.document).map(([key, val]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</TableCell>
                    <TableCell>{String(val)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}
