import React, { Suspense, use } from "react";
import NavBar from "../../components/NavBar";
import Tabs from "../../components/Tabs";
import Overview from "../../components/Overview";
import { FungibleToken } from "../../types/fungibleToken";
import NFTs from "@/app/components/NFTs";
import Tokens from "@/app/components/Tokens";
import { NonFungibleToken } from "@/app/types/nonFungibleToken";

export default async function PortfolioPage({
  searchParams,
  params,
}: {
  searchParams: { view: string };
  params: { walletAddress: string };
}) {
  const fungibleTokenData: FungibleToken[] = await getFungibleData(
    params.walletAddress,
  );
  const nonFungibleTokenData: NonFungibleToken[] = await getNonFungibleData(
    params.walletAddress,
  );
  console.log(params.walletAddress);
  return (
    <div>
      <div className="m-10">
        <div className="m-5 mb-10">
          <NavBar />
        </div>
        <div className="mx-5 my-4">
          <Tabs
            searchParams={searchParams}
            walletAddress={params.walletAddress}
          />
        </div>
        <Suspense fallback={<div>Loading...</div>} key={searchParams.view}>
          <div className="mx-5 my-4">
            {searchParams.view === "overview" && (
              <Overview tokens={fungibleTokenData} />
            )}
            {searchParams.view === "tokens" && (
              <Tokens tokens={fungibleTokenData} />
            )}
            {searchParams.view === "nfts" && (
              <NFTs tokens={nonFungibleTokenData} />
            )}
          </div>
        </Suspense>
      </div>
    </div>
  );
}

async function getFungibleData(walletAddress: string) {
  console.log(walletAddress);
  const url = `https://glori-cpoxlw-fast-mainnet.helius-rpc.com/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        ownerAddress: walletAddress,
        tokenType: "fungible",
        displayOptions: {
          showNativeBalance: true,
        },
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data`);
  }
  const data = await response.json();
  //console.log(JSON.stringify(data.result, null, 2));
  const tokens: FungibleToken[] = data.result.items;
  console.log(JSON.stringify(tokens, null, 2));
  return tokens;
}
async function getNonFungibleData(walletAddress: string) {
  const url = `https://glori-cpoxlw-fast-mainnet.helius-rpc.com/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        ownerAddress: walletAddress,
        tokenType: "nonFungible",
      },
    }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch data`);
  }
  const data = await response.json();
  //console.log(JSON.stringify(data.result, null, 2));
  const tokens: NonFungibleToken[] = data.result.items;
  // console.log(JSON.stringify(tokens, null, 2));
  return tokens;
}
