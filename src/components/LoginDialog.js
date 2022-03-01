import { /*useState,*/ useEffect } from "react";
import axios from "axios";
import useWebSocket/*, { ReadyState }*/ from "react-use-websocket";
import { Box, Dialog/*, DialogTitle, Divider*/ } from '@mui/material';
import { useContext } from 'react'
import Context from '../Context'

const SERVER_BASE_URL = 'http://127.0.0.1:81/api/xumm';

export default function LoginDialog(props) {
    const { accountProfile } = useContext(Context);
    //const log = props.log;
    const { lastMessage/*, readyState */ } = useWebSocket(accountProfile.socketUrl, { share: true });
    
    /*const connectionStatus = {
        [ReadyState.CONNECTING]: "Connecting",
        [ReadyState.OPEN]: "Open",
        [ReadyState.CLOSING]: "Closing",
        [ReadyState.CLOSED]: "Closed",
        [ReadyState.UNINSTANTIATED]: "Uninstantiated",
    }[readyState];*/

    const getAccountStatus = async () => {
        try {
            const res = await axios.get(`${SERVER_BASE_URL}/payload/${accountProfile.payload.data.uuid}`);
            if (res.status === 200) {
                props.handleSetAccount(res.data.data.response.account);
            }
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
            {accountProfile && accountProfile.payload && accountProfile.payload.status && (
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
                        src={accountProfile.payload.data.qrUrl}
                        />
                </div>
            )}
      </Dialog>
    );
}
