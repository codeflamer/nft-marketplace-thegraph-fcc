import Head from "next/head";
import React from "react";
import { Form, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.json";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftMarketPlace.json";
import networkMapping from "../constants/networkMapping.json";

const sellNft = () => {
    const { chainId } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString : "31337";
    // console.log(networkMapping[chainString]["NftMarketplace"][0]);
    const marketplaceAddress = "0xBC2c5549fA51F31B3DfBB3F6867ACE88311cf06F";
    console.log(marketplaceAddress);

    const dispatch = useNotification();
    const { runContractFunction } = useWeb3Contract();

    const approveAndlist = async (data) => {
        console.log("Approving...");
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString();

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        };

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (err) => console.log(err),
        });
    };

    const handleApproveSuccess = async (nftAddress, tokenId, price) => {
        console.log("Ok! Time to list");
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress,
                tokenId,
                price,
            },
        };
        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (err) => console.log(err),
        });
    };

    const handleListSuccess = () => {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        });
    };

    return (
        <div>
            <Head>
                <title>Sell NFT</title>
                <meta name="description" content="NFT Sell Page" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Form
                onSubmit={approveAndlist}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
        </div>
    );
};

export default sellNft;
