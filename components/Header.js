import Link from "next/link";
import React from "react";
import { useMoralis } from "react-moralis";
import { ConnectButton } from "web3uikit";

console.log(`${process.env.NEXT_PUBLIC_SERVER_URL}`);

const Header = () => {
    const { authenticate, isAuthenticated, user } = useMoralis();
    // console.log(isAuthenticated);
    return (
        <nav className="flex items-center justify-between border-b-2">
            <h2 className="py-4 px-4 text-3xl font-bold">Nft Market Place</h2>
            <div className="flex items-center">
                <Link href="/">
                    <a className="mr-6 p-6">Home</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-6 p-6">Sell Nft</a>
                </Link>
                <ConnectButton />
            </div>
        </nav>
    );
};

export default Header;
