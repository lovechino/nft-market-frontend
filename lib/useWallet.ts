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
    if (typeof window.ethereum !== 'undefined') {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);
      
      // Kiểm tra xem đã kết nối chưa
      checkConnection(newProvider);
    }
  }, []);

  const checkConnection = async (provider: ethers.BrowserProvider) => {
    try {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAddress(accounts[0].address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
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
    } catch (error: any) {
      setError(error.message || 'Lỗi khi kết nối ví');
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
    disconnect
  };
};
