import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Card, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/nftMarketPlace.json";
import basicNftAbi from "../constants/BasicNft.json";
import UpdateListingModal from "./UpdateListingModal";
import { ethers } from "ethers";

const truncateString = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr;
    console.log(fullStr);

    const seperator = "....";
    const seperatorLength = seperator.length;
    const charsToShow = strLen - seperatorLength;
    const frontChar = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        fullStr.substring(0, frontChar) + seperator + fullStr.substring(fullStr.length - backChars)
    );
};

const NFTBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
    const dispatch = useNotification();
    const { isWeb3Enabled, account } = useMoralis();
    const [imageURI, setImageURI] = useState("");
    const [tokenName, setTokenName] = useState("");
    const [tokenDescription, setTokenDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress,
            tokenId,
        },
    });

    const updateUI = async () => {
        const tokenURI = await getTokenURI();
        // console.log(tokenURI);
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenURIResponse = await (await fetch(requestURL)).json();
            const imageURI = tokenURIResponse.image;
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageURI(imageURIURL);
            setTokenName(tokenURIResponse.name);
            setTokenDescription(tokenURIResponse.description);
        }
    };

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);

    const isOwnedByUser = seller === account || seller === undefined;
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateString(seller || "", 15);

    const handleCardClick = async () => {
        isOwnedByUser
            ? setShowModal(true)
            : await buyItem({
                  onError: (err) => console.log(err),
                  onSuccess: handleBuyItemSuccess,
              });
    };

    const handleBuyItemSuccess = () => {
        dispatch({
            type: "success",
            message: "Item bought",
            title: "Item Bought",
            position: "topR",
        });
    };

    return (
        <div>
            <div>
                {imageURI ? (
                    <>
                        <UpdateListingModal
                            isVisible={showModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    />
                                    <div>{ethers.utils.formatUnits(price, "ether")}</div>
                                </div>
                            </div>
                        </Card>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default NFTBox;
