import { ethers } from "ethers";
import Marketplace from "./contracts/Marketplace.json";

const MARKETPLACE_ADDRESS = "0x6005b3432200D9Ae8ec786e5C7caB06F4429a1E8";

export const getMarketplaceContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(MARKETPLACE_ADDRESS, Marketplace.abi, providerOrSigner);
};
