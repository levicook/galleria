"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Grouping, NonFungibleToken } from "@/app/types";

interface NFTFiltersProps {
  nftDataArray: NonFungibleToken[];
}

const NFTFilters = ({ nftDataArray }: NFTFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collectionFilter = searchParams.get("collection");
  const typeFilter = searchParams.get("type");
  const blocklistFilter = searchParams.get("blocklist");
  const [collections, setCollections] = useState<Grouping[]>([]);

  useEffect(() => {
    // Extract unique collection values from nftDataArray
    const collectionMap = new Map<string, Grouping>();
    nftDataArray.forEach((nft) => {
      const collection = nft.grouping.find((g) => g.group_key === "collection");
      if (collection && collection.collection_metadata) {
        collectionMap.set(collection.group_value, collection);
      }
    });
    setCollections(Array.from(collectionMap.values()));
  }, [nftDataArray]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const handleCollectionFilter = (collection: string) => {
    const queryString = createQueryString("collection", collection);
    router.push(`${pathname}?${queryString}`);
  };
  const handleTypeFilter = (type: string) => {
    const queryString = createQueryString("type", type);
    router.push(`${pathname}?${queryString}`);
  };
  const handleBlocklistFilter = (blocklist: string) => {
    const queryString = createQueryString("blocklist", blocklist);
    router.push(`${pathname}?${queryString}`);
  };

  const handleNoFilter = (type: string) => {
    if (type === "collection") {
      // Create a new instance of URLSearchParams
      const newSearchParams = new URLSearchParams(searchParams);
      // Delete the 'collection' parameter
      newSearchParams.delete("collection");

      // Navigate to the updated URL
      const newURL = `${pathname}?${newSearchParams.toString()}`;
      router.push(newURL);
    } else if (type === "type") {
      // Create a new instance of URLSearchParams
      const newSearchParams = new URLSearchParams(searchParams);
      // Delete the 'type' parameter
      newSearchParams.delete("type");

      // Navigate to the updated URL
      const newURL = `${pathname}?${newSearchParams.toString()}`;
      router.push(newURL);
    } else if (type === "blocklist") {
      // Create a new instance of URLSearchParams
      const newSearchParams = new URLSearchParams(searchParams);
      // Delete the 'blocklist' parameter
      newSearchParams.delete("blocklist");

      // Navigate to the updated URL
      const newURL = `${pathname}?${newSearchParams.toString()}`;
      router.push(newURL);
    }
  };

  return (
    <div className="flex w-full flex-col px-2 py-2">
      <h1 className="text-2xl font-bold">Filters</h1>

      {/* Collection */}
      <ul className="menu mt-6 w-full rounded-md bg-gray-500/20">
        <li>
          <details>
            <summary className="text-base font-bold">Collection</summary>
            <ul className="max-h-60 overflow-y-auto">
              {/* Scrollable list */}
              {/* No Filter Option */}
              <li
                onClick={() => handleNoFilter("collection")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  !collectionFilter ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">All Collections</a>
              </li>
              {/* Collection Filters */}
              {collections.map((collection) =>
                collection.collection_metadata ? (
                  <li
                    key={collection.group_value}
                    onClick={() =>
                      handleCollectionFilter(collection.group_value)
                    }
                    className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                      collectionFilter === collection.group_value
                        ? "text-primary"
                        : "text-white"
                    }`}
                  >
                    <a className="block px-4 py-2 text-sm">
                      {collection.collection_metadata.name}
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </details>
        </li>
      </ul>

      {/* NFT Type */}
      <ul className="menu mt-2 w-full rounded-md bg-gray-500/20">
        <li>
          <details>
            <summary className="text-base font-bold">NFT Type</summary>
            <ul className="max-h-60 overflow-y-auto">
              {/* Scrollable list */}
              {/* No Filter Option */}
              <li
                onClick={() => handleNoFilter("type")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  !typeFilter ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">All Types</a>
              </li>
              {/* NFT Type Filters */}

              <li
                key={"Standard NFT"}
                onClick={() => handleTypeFilter("StandardNFT")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  typeFilter === "StandardNFT" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Standard NFTs"}</a>
              </li>
              <li
                key={"Compressed NFT"}
                onClick={() => handleTypeFilter("CompressedNFT")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  typeFilter === "CompressedNFT" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Compressed NFTs"}</a>
              </li>
              <li
                key={"Programmable NFT"}
                onClick={() => handleTypeFilter("ProgrammableNFT")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  typeFilter === "ProgrammableNFT"
                    ? "text-primary"
                    : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Programmable NFTs"}</a>
              </li>
              <li
                key={"Inscriptions"}
                onClick={() => handleTypeFilter("Inscriptions")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  typeFilter === "Inscriptions" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Inscriptions"}</a>
              </li>
              <li
                key={"SPL20"}
                onClick={() => handleTypeFilter("SPL20")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  typeFilter === "SPL20" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"SPL20"}</a>
              </li>
            </ul>
          </details>
        </li>
      </ul>

      {/* Blocklist */}
      <ul className="menu mt-2 w-full rounded-md bg-gray-500/20">
        <li>
          <details>
            <summary className="text-base font-bold">Blocklist</summary>
            <ul className="max-h-60 overflow-y-auto">
              {/* Scrollable list */}

              {/* Blocklist Option: None */}
              <li
                onClick={() => handleNoFilter("blocklist")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  !blocklistFilter ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">None</a>
              </li>

              {/* Blocklist Option: phantom-allowed */}
              <li
                key={"phantom-allowed"}
                onClick={() => handleBlocklistFilter("phantom-allowed")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  blocklistFilter === "phantom-allowed" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Phantom Allowed"}</a>
              </li>

              {/* Blocklist Option: phantom-blocked */}
              <li
                key={"phantom-blocked"}
                onClick={() => handleBlocklistFilter("phantom-blocked")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  blocklistFilter === "phantom-blocked" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Phantom Blocked"}</a>
              </li>

              {/* Blocklist Option: solflare-allowed */}
              <li
                key={"solflare-allowed"}
                onClick={() => handleBlocklistFilter("solflare-allowed")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  blocklistFilter === "solflare-allowed" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Solflare Allowed"}</a>
              </li>

              {/* Blocklist Option: solflare-blocked */}
              <li
                key={"solflare-blocked"}
                onClick={() => handleBlocklistFilter("solflare-blocked")}
                className={`w-full font-medium hover:bg-neutral-700 hover:bg-opacity-60 ${
                  blocklistFilter === "solflare-blocked" ? "text-primary" : "text-white"
                }`}
              >
                <a className="block px-4 py-2 text-sm">{"Solflare Blocked"}</a>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
  );
};

export default NFTFilters;
