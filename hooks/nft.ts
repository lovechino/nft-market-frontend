import { ethers } from "ethers";
import NFT from "./contracts/NFT.json";

const NFT_ADDRESS = "0x22FB726b8f1C1Eef3644B2ee73aA943AF98d2414";

export const getNFTContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(NFT_ADDRESS, NFT.abi, providerOrSigner);
};
