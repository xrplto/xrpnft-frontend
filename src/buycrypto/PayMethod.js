// Material
import { withStyles } from '@mui/styles';
import {
    alpha, styled,
    Stack,
    ToggleButton,
    Typography
} from '@mui/material';

// Utils
import { fIntNumber } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------
const Label = withStyles({
    root: {
        color: alpha('#637381', 0.99),
    }
})(Typography);

// ----------------------------------------------------------------------

// "payment_method_id": 6033,
// "type": "FIAT_TO_CRYPTO",
// "spot_price_fee": "0.01",
// "spot_price_including_fee": "0.39",
// "coin_amount": "254.43787000",
// "coin_code": "XRP",
// "fiat_amount": "100.00",
// "fiat_code": "USD",
// "fee_amount": "1.96",
// "network_fee": "0.00",
// "paymentType": "WORLDPAYCREDIT",
// "name": "Visa/Mastercard",
// "description": "Conveniently buy digital currency using your personal VISA or MasterCard.",
// "logo_url": "https://xrplto.banxa-sandbox.com/images/payment-providers/worldpaycredit.png",
// "status": "ACTIVE",
// "supported_agents": null,
// "transaction_limit": {
//      "fiat_code": "USD",
//      "min": "20",
//      "max": "15000"
// }

export default function PayMethod({method, idx, selected, setSelected}) {

    const {
        payment_method_id,
        logo_url,
        name,
        spot_price_including_fee,
        transaction_limit,
        fiat_code,
        coin_code,
        fee_amount
    } = method;

    let limit_min = 0;
    let limit_max = 0;
    try {
        limit_min = transaction_limit.min;
        limit_max = transaction_limit.max;
    } catch (err) {}

    // return (
    //     <Button fullWidth variant="outlined" sx={{p:3}}>
    //         <Stack spacing={0.5} alignItems='center'>
    //             <img
    //                 alt={'wallet'}
    //                 src={logo_url}
    //                 style={{ height: 36 }}
    //             />
    //             <Typography variant="pay_name">{name}</Typography>
    //             <Typography variant="pay_name"><Label variant="pay_label">Limit:</Label> {fIntNumber(limit_min)} - {fIntNumber(limit_max)}</Typography>
    //             <Typography variant="pay_name">{spot_price_including_fee} <Label variant="pay_label">{fiat_code}/{coin_code}</Label></Typography>
    //         </Stack>
    //     </Button>
    // );

    return (
        <ToggleButton
            fullWidth
            disableRipple
            value="check"
            color="info"
            selected={selected === idx}
            onChange={() => {
                setSelected(idx);
            }}
            sx={{pt:3, pb:3}}
        >
            <Stack spacing={0.5} alignItems='center'>
                <img
                    alt={'wallet'}
                    src={logo_url}
                    style={{ height: 36 }}
                />
                <Typography variant="pay_name">{name}</Typography>
                <Typography variant="pay_name"><Label variant="pay_label">Limit:</Label> {fIntNumber(limit_min)} - {fIntNumber(limit_max)}</Typography>
                <Typography variant="pay_name">{spot_price_including_fee} <Label variant="pay_label">{fiat_code}/{coin_code}</Label></Typography>
            </Stack>
        </ToggleButton>
    )
}
