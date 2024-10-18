import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    LinearProgress
} from '@mui/material';

export default function BatchProcessingDialog({ open, onClose, qrUrl, nextUrl, batchProgress, currentNFT }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Batch Processing NFTs
            </DialogTitle>
            <DialogContent>
                {qrUrl && (
                    <Box display="flex" justifyContent="center" mb={2}>
                        <img src={qrUrl} alt="QR Code" style={{ width: '200px', height: '200px' }} />
                    </Box>
                )}
                <Typography variant="body1" align="center" gutterBottom>
                    Scan the QR code with your XUMM wallet to sign the transaction for NFT {currentNFT}.
                </Typography>
                <Box mt={2}>
                    <Typography variant="body2" align="center" gutterBottom>
                        Progress: {batchProgress.current} / {batchProgress.total}
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(batchProgress.current / batchProgress.total) * 100}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                {nextUrl && (
                    <Button
                        href={nextUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        variant="contained"
                    >
                        Open in XUMM
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
