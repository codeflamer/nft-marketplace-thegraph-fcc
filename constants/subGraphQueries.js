import { gql } from "@apollo/client";

const ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            tokenId
            seller
            price
            nftAddress
        }
    }
`;

export default ACTIVE_ITEMS;
