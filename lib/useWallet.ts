'use client';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const checkConnection = async (provider: ethers.BrowserProvider) => {
    try {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0].address);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const connect = async () => {
    if (!provider) {
      setError('MetaMask chưa được cài đặt!');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message || 'Lỗi khi kết nối ví');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setError(null);
  };

  return {
    address,
    provider,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
  };
};
