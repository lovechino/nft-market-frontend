'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);

  // ✅ Khởi tạo provider + kiểm tra kết nối
  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum;
        const newProvider = new ethers.BrowserProvider(ethereum);
        setProvider(newProvider);
        await checkConnection(newProvider);
      }
    };
    init();
  }, []);

  // ✅ Hàm kiểm tra kết nối
  const checkConnection = async (provider: ethers.BrowserProvider) => {
    try {
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      setNetworkName(network.name);

      if (accounts.length > 0) {
        setAddress(accounts[0].address);
        setIsConnected(true);

        // ⚠️ Nếu chưa ở Sepolia => yêu cầu chuyển
        if (Number(network.chainId) !== 11155111) {
          await switchToSepolia();
        }
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  // ✅ Kết nối ví
  const connect = async () => {
    if (!provider) {
      setError('MetaMask chưa được cài đặt!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      setAddress(accounts[0]);
      setIsConnected(true);
      setNetworkName(network.name);

      if (Number(network.chainId) !== 11155111) {
        await switchToSepolia();
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kết nối ví');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Hàm chuyển sang mạng Sepolia
 const switchToSepolia = async () => {
  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    alert("❌ MetaMask chưa được cài đặt!");
    return;
  }

  try {
    // Thử chuyển sang Sepolia
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0xaa36a7" }], // ✅ Hexadecimal for 11155111
    });

    console.log("✅ Đã chuyển sang mạng Sepolia");
  } catch (switchError: any) {
    // Nếu mạng chưa có thì thêm vào MetaMask
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0xaa36a7",
              chainName: "Sepolia Test Network",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        console.log("✅ Đã thêm và chuyển sang Sepolia");
      } catch (addError) {
        console.error("Add chain error:", addError);
      }
    } else {
      // Log chi tiết lỗi để xem rõ
      console.error("Switch network error:", JSON.stringify(switchError, null, 2));
    }
  }
};


  // ✅ Ngắt kết nối ví
  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
  };

  return {
    address,
    provider,
    networkName,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
  };
};
