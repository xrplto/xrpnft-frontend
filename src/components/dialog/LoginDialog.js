// Material
import {
    Box,
    Dialog
} from '@mui/material';

export default function LoginDialog(props) {
    const qrUrl = props.qrUrl;

    const onClose = () => {
        props.handleClose();
    };

    return (
        <Dialog onClose={onClose} open={props.open}>
            {/* <DialogTitle>Scan the QR code from your XUMM app</DialogTitle> */}
            {/* <Divider /> */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >

                <Box
                    component="img"
                    sx={{
                    }}
                    alt="QR"
                    src={qrUrl}
                    />
            </div>
      </Dialog>
    );
}
