import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from "@apollo/client";
import Header from "../components/Header";
import "../styles/globals.css";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
// console.log(APP_ID, SERVER_URL);
const client = new ApolloClient({
    uri: "https://api.studio.thegraph.com/query/32678/nftmarketplace/v0.0.1",
    cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
    if (!APP_ID || !SERVER_URL)
        throw new Error(
            "Missing Moralis Application ID and or SERVER URL. Make sure to set your .env file."
        );
    return (
        <div>
            <Head>
                <title>NFT MarketPlace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </div>
    );
}

export default MyApp;
