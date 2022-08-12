import React, { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/nftMarketPlace.json";
import { ethers } from "ethers";

const UpdateListingModal = ({ nftAddress, tokenId, isVisible, onClose }) => {
    const dispatch = useNotification();
    const [priceToUpdateListingWith, setPriceTopUpdataListingWith] = useState(0);
    const marketplaceAddress = "0xBC2c5549fA51F31B3DfBB3F6867ACE88311cf06F";
    // console.log(priceToUpdateListingWith);

    const handleUpdatListingSuccess = async (tx) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing updated - please refresh and move block",
            position: "topR",
        });
        onClose && onClose();
        setPriceTopUpdataListingWith("0");
    };

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress,
            tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    });

    return (
        <Modal
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: handleUpdatListingSuccess,
                });
            }}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
        >
            <Input
                label="update listing price in l1 Currenct ETH"
                name="NEw Listing price"
                type="number"
                onChange={(e) => {
                    setPriceTopUpdataListingWith(e.target.value);
                }}
            />
        </Modal>
    );
};

export default UpdateListingModal;
