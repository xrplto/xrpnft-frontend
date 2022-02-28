import { useState, useEffect } from "react";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Box, Dialog, DialogTitle, Divider } from '@mui/material';

const SERVER_BASE_URL = 'http://127.0.0.1:81/api/xumm';

{/* <a href={payload.data.next}>
    <button>Open XUMM</button>
</a>
<p>account: {account}</p>
{messageHistory &&
    messageHistory.map((message, i) => <p key={i}>{message}</p>)} */}

export default function LoginDialog(props) {
    const payload = props.payload;
    const socketUrl = props.socketUrl;
    const log = props.log;
    const { lastMessage, readyState } = useWebSocket(socketUrl, { share: true });
    const [account, setAccount] = useState(null);
    
    const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];

    const getAccountStatus = async () => {
        try {
            const res = await axios.get(`${SERVER_BASE_URL}/payload/${payload.data.uuid}`);
            if (res.status === 200)
                setAccount(res.data.data.response.account);
        } catch (err) {
        }
    };

    useEffect(() => {
        if (lastMessage) {
            getAccountStatus();
        }
    }, [lastMessage]);

    const onClose = () => {
        props.handleClose();
    };

    return (
        <Dialog onClose={onClose} open={props.open}>
            {/* <DialogTitle>Scan the QR code from your XUMM app</DialogTitle> */}
            {/* <Divider /> */}
            {payload && payload.status && (
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
                        src={payload.data.qrUrl}
                        />
                </div>              
            )}
      </Dialog>
    );
}
