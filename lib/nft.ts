import { ethers } from 'ethers';
import NFT_ABI from './contracts/NFT.json';

export const getNFTContract = (provider: ethers.Provider) => {
  const contractAddress = process.env.NEXT_PUBLIC_NFT_ADDRESS;
  if (!contractAddress) {
    throw new Error('NEXT_PUBLIC_NFT_ADDRESS is not defined');
  }
  return new ethers.Contract(contractAddress, NFT_ABI.abi, provider);
};

