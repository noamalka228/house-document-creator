'use client';
import { useState } from 'react';
import { Buffer } from 'buffer';
import {
  Container, Typography, Box, Button, MenuItem, Select,
  InputLabel, FormControl, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, TextField
} from '@mui/material';

const SUPPORTED_DOC_TYPES = [
  { value: 'bill', label: 'Bill' },
  { value: 'price_proposal', label: 'Price Proposal' }
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setExtractedText(null);
      setResult(null);
    }
  };

  const handleDocTypeChange = (value: string) => {
    setDocType(value);
    setExtractedText(null);
    setResult(null);
  };

  const handleExtractText = async () => {
    if (!file || !docType) return;
    setLoading(true);
    setExtractedText(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', docType);

    try {
      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setExtractedText(data.content);
    } catch (err: any) {
      alert(`Error extracting text: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocument = async () => {
    if (!extractedText || !docType) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('content', extractedText);
    formData.append('documentType', docType);
    formData.append('fileName', file ? file.name : 'document.xlsx');

    try {
      const res = await fetch('/api/create-document', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      alert(`Error generating document: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadXLSX = () => {
    if (!result?.xlsxBase64) return;

    const buffer = Buffer.from(result.xlsxBase64, 'base64');
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${docType}_export.xlsx`);
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
        <Typography variant="h6" gutterBottom>Step 1: Upload Document</Typography>
        <Box display="flex" flexDirection="column" gap={3}>
          <FormControl fullWidth>
            <InputLabel>Document Type</InputLabel>
            <Select
              value={docType || ''}
              label="Document Type"
              onChange={(e) => handleDocTypeChange(e.target.value)}
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
            onClick={handleExtractText}
            disabled={!file || !docType || loading}
            sx={{ py: 1.5 }}
          >
            {loading && !extractedText ? <CircularProgress size={24} color="inherit" /> : 'Extract Text'}
          </Button>
        </Box>
      </Paper>

      {extractedText !== null && !result && (
        <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, border: '2px solid #1976d2' }}>
          <Typography variant="h6" gutterBottom color="primary">Step 2: Review Extract</Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Review and edit the extracted Hebrew text if there are any OCR errors.
          </Typography>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              multiline
              minRows={10}
              maxRows={20}
              fullWidth
              variant="outlined"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              dir="rtl"
              sx={{ fontFamily: 'monospace' }}
            />

            <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleGenerateDocument}
              disabled={!extractedText || loading}
              sx={{ py: 1.5, mt: 2 }}
            >
              {loading && extractedText !== null ? <CircularProgress size={24} color="inherit" /> : 'Accept & Generate Document'}
            </Button>
          </Box>
        </Paper>
      )}

      {result && result.document && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6">Step 3: Extracted Data</Typography>
            <Button variant="contained" color="secondary" onClick={downloadXLSX}>
              Download XLSX
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
