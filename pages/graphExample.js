import React from "react";
import { useQuery, gql } from "@apollo/client";

const ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            tokenId
            seller
            price
        }
    }
`;

const graphExample = () => {
    const { loading, data, error } = useQuery(ACTIVE_ITEMS);
    console.log(data);
    return <div>graphExample</div>;
};

export default graphExample;
