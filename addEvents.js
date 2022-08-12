const Moralis = require("moralis/node");
require("dotenv").config();
const contractAddresses = require("./constants/networkMapping.json");

let chainId = process.env.chainId || 31337;
let moralisChainId = chainId === "31337" ? "1337" : chainId;

const contractAddress = contractAddresses[chainId]["NftMarketplace"][0];
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

const main = async () => {
    console.log("Connecting....");
    console.log(Moralis.CoreManager.get("VERSION"));
    await Moralis.start({ serverUrl, appId, masterKey });
    console.log(`Working with Contract Address ${contractAddress}`);

    let ItemListedOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemListed(address,address,uint256,uint256)",
        tableName: "ItemListed",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemListed",
            type: "event",
        },
    };

    let ItemBoughtOptions = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemBought(address,address,uint256,uint256)",
        tableName: "ItemBought",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "buyer",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "price",
                    type: "uint256",
                },
            ],
            name: "ItemBought",
            type: "event",
        },
    };

    let ItemCanceledOption = {
        chainId: moralisChainId,
        address: contractAddress,
        topic: "ItemCanceled(address,address,uint256)",
        tableName: "ItemCanceled",
        sync_historical: true,
        abi: {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "seller",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "nftAddress",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "uint256",
                    name: "tokenId",
                    type: "uint256",
                },
            ],
            name: "ItemCanceled",
            type: "event",
        },
    };

    const listedReponse = await Moralis.Cloud.run("watchContractEvent", ItemListedOptions, {
        useMasterKey: true,
    });
    const boughtResponse = await Moralis.Cloud.run("watchContractEvent", ItemBoughtOptions, {
        useMasterKey: true,
    });
    const canceledResponse = await Moralis.Cloud.run("watchContractEvent", ItemCanceledOption, {
        useMasterKey: true,
    });

    if (listedReponse.success && boughtResponse.response && canceledResponse.response) {
        console.log("Success! Database Updated");
    } else {
        console.log("Something went wrong.....");
    }
};

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.log(err);
        process.exit(1);
    });
