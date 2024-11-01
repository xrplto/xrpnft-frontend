// Material
import {
    Box,
    Container,
    styled,
    Toolbar,
    Typography,
    Stack,
    alpha
} from '@mui/material';

// Components
import Header from 'src/components/Header';
import Footer from 'src/components/Footer';
import ScrollToTop from 'src/components/ScrollToTop';

const OverviewWrapper = styled(Box)(
    ({ theme }) => `
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: ${alpha(theme.palette.background.default, 0.9)};
`
);

const ContentWrapper = styled(Box)(
    ({ theme }) => `
        flex: 1;
        background-color: ${alpha(theme.palette.background.paper, 0.1)};
        border-radius: ${theme.shape.borderRadius * 2}px;
        padding: ${theme.spacing(4)};
        margin: ${theme.spacing(3)} 0;
        box-shadow: 0 8px 32px 0 ${alpha(theme.palette.primary.main, 0.1)};
        border: 1px solid ${alpha(theme.palette.primary.main, 0.1)};
`
);

const Section = styled(Box)(
    ({ theme }) => `
        margin-bottom: ${theme.spacing(4)};
`
);

export default function Terms() {
    return (
        <OverviewWrapper>
            <Toolbar id="back-to-top-anchor" />

            <Header />

            <Container maxWidth="lg">
                <ContentWrapper>
                    <Stack spacing={3}>
                        <Typography variant="h1" color="primary.main">
                            XRPNFT Terms of Service
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                            Last Updated: November 1, 2024
                        </Typography>

                        <Typography variant="body1">
                            Welcome to XRPNFT, an NFT marketplace on the XRP Ledger. By accessing or using our platform, 
                            you agree to comply with and be bound by the following Terms of Service.
                        </Typography>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                1. Acceptance of Terms
                            </Typography>
                            <Typography variant="body1">
                                By using XRPNFT, you acknowledge that you have read, understood, and agree to these Terms of Service.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                2. Eligibility
                            </Typography>
                            <Typography variant="body1">
                                The use of this blockchain product must be legal in your jurisdiction. By accessing XRPNFT, 
                                you represent and warrant that your use of the platform complies with all applicable laws 
                                and regulations in your location.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                3. Account Responsibilities
                            </Typography>
                            <Stack spacing={2}>
                                <Typography variant="body1">
                                    <strong>Account Security:</strong> You are responsible for maintaining the confidentiality 
                                    of your account information and all activities that occur under your account.
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Accurate Information:</strong> Information associated with your account is verified 
                                    through web3 login methods such as Xaman, Crossmark, or Gem Wallet, ensuring its accuracy 
                                    and completeness. By using these secure authentication methods, XRPNFT relies on the 
                                    integrity of the connected wallet providers to maintain accurate and up-to-date information 
                                    for your account.
                                </Typography>
                            </Stack>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                4. Use of the Platform
                            </Typography>
                            <Typography variant="body1">
                                You agree to use XRPNFT only for lawful purposes and in accordance with these Terms of Service.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                5. NFT Minting and Ownership
                            </Typography>
                            <Stack spacing={2}>
                                <Typography variant="body1">
                                    <strong>Minting NFTs:</strong> Users may mint NFTs on the platform in accordance with our guidelines.
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Ownership Claims:</strong> If an NFT represents a project, brand, or work, 
                                    the original project owner must claim the NFT to establish ownership.
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Unclaimed NFTs:</strong> Owners will be notified and given 48 hours to claim their NFTs. 
                                    If the original project owner does not claim the NFT within this 48-hour period, XRPNFT will 
                                    attempt to contact the owner through the registered contact information. If the owner remains 
                                    inactive and does not respond or claim the NFT after these notification attempts, the NFT will 
                                    be burned (permanently destroyed).
                                </Typography>
                            </Stack>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                6. Fees and Payments
                            </Typography>
                            <Stack spacing={2}>
                                <Typography variant="body1">
                                    <strong>XRPNFT Fees:</strong> XRPNFT does not charge any fees for transactions conducted 
                                    on the platform.
                                </Typography>
                                <Typography variant="body1">
                                    <strong>XRP Ledger Transaction Fees:</strong> Please note that the XRP Ledger charges a 
                                    basic transaction fee for processing transactions on the network. These fees are necessary 
                                    to maintain the network and prevent spam. The transaction fee amount will be displayed 
                                    during the transaction process.
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Payment Methods:</strong> All payments are conducted via the XRP Ledger.
                                </Typography>
                            </Stack>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                7. Prohibited Activities
                            </Typography>
                            <Typography variant="body1">
                                Users are prohibited from:
                            </Typography>
                            <Stack component="ul" spacing={1} sx={{ pl: 4 }}>
                                <Typography component="li" variant="body1">
                                    Engaging in any activity that violates any applicable law or regulation.
                                </Typography>
                                <Typography component="li" variant="body1">
                                    Minting or distributing NFTs that infringe upon the intellectual property rights of others.
                                </Typography>
                                <Typography component="li" variant="body1">
                                    Using the platform to transmit harmful or disruptive content.
                                </Typography>
                            </Stack>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                8. Intellectual Property Rights
                            </Typography>
                            <Typography variant="body1">
                                All content provided on the platform is the property of XRPNFT or its content suppliers 
                                and is protected by intellectual property laws.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                9. Limitation of Liability
                            </Typography>
                            <Typography variant="body1">
                                XRPNFT shall not be liable for any indirect, incidental, special, consequential, or punitive 
                                damages arising out of or relating to your use of the platform.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                10. Termination
                            </Typography>
                            <Typography variant="body1">
                                We reserve the right to suspend or terminate your access to the platform at our discretion, 
                                without notice, for any violation of these Terms of Service.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                11. Changes to Terms
                            </Typography>
                            <Typography variant="body1">
                                XRPNFT may revise these Terms of Service at any time. Updated terms will be posted on this 
                                page with the date of revision.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                12. Governing Law
                            </Typography>
                            <Typography variant="body1">
                                These Terms of Service are governed by and construed in accordance with the laws of the 
                                State of California, without regard to its conflict of law principles.
                            </Typography>
                        </Section>

                        <Section>
                            <Typography variant="h4" gutterBottom>
                                13. Contact Information
                            </Typography>
                            <Typography variant="body1">
                                For any questions about these Terms of Service, please contact us at legal@xrpnft.com.
                            </Typography>
                        </Section>
                    </Stack>
                </ContentWrapper>
            </Container>

            <ScrollToTop />
            <Footer />
        </OverviewWrapper>
    );
}

export async function getStaticProps() {
    const ogp = {
        canonical: 'https://xrpnft.com/terms',
        title: 'Terms of Service - XRPNFT',
        url: 'https://xrpnft.com/terms',
        imgUrl: 'https://xrpnft.com/static/ogp.png',
        desc: 'Terms of Service for XRPNFT - The largest NFT marketplace on the XRP Ledger.'
    };

    return {
        props: { ogp }
    };
} 