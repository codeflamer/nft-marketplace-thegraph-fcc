import { useMoralis, useMoralisQuery } from "react-moralis";
import NFTBox from "../components/NFTBox";
import { useQuery, gql } from "@apollo/client";
import ACTIVE_ITEMS from "../constants/subGraphQueries";

export default function Home() {
    const { isWeb3Enabled } = useMoralis();
    const { loading: fetchingListdNfts, data: listedNfts, error } = useQuery(ACTIVE_ITEMS);
    console.log(listedNfts);

    return (
        <div className="container mx-auto mb-10">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap gap-4">
                {isWeb3Enabled ? (
                    fetchingListdNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts?.activeItems?.map((nft) => {
                            console.log(nft);
                            const { price, nftAddress, tokenId, seller } = nft;
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress="0xBC2c5549fA51F31B3DfBB3F6867ACE88311cf06F"
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            );
                        })
                    )
                ) : (
                    <div>Web3 not Enabled</div>
                )}
            </div>
        </div>
    );
}
