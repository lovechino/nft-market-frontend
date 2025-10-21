'use client';
import { useState } from 'react';
import { useWallet } from '@/lib/useWallet';
import { ethers } from 'ethers';
import NFT_ABI from '@/lib/contracts/NFT.json';
import MyNFTs from '@/components/MyNFTs';
import MarketplacePage from '@/components/MarketplacePage';

export default function Home() {
  const { address, provider, connect } = useWallet();
  const [activeTab, setActiveTab] = useState<'mint' | 'my-nfts' | 'marketplace'>('marketplace');

  const mintNFT = async () => {
    if (!provider || !address) return alert('Chưa có ví');
    const signer = await provider.getSigner();
    const nft = new ethers.Contract(process.env.NEXT_PUBLIC_NFT_ADDRESS!, NFT_ABI.abi, signer);

    const tx = await nft.mintNFT(address, 'ipfs://QmABC123xyz');
    await tx.wait();
    alert('✅ Mint NFT thành công!');
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                NFT Marketplace
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Khám phá, sưu tập và giao dịch NFT độc đáo
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Kết nối ví của bạn</h2>
                <p className="text-gray-600">Để bắt đầu khám phá thế giới NFT</p>
              </div>
              
              <button 
                onClick={connect} 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                🔗 Kết nối MetaMask
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                NFT Marketplace
              </h1>
            </div>
            
            {/* Wallet Info */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'marketplace'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🏪 Marketplace
            </button>
            <button
              onClick={() => setActiveTab('my-nfts')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'my-nfts'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🖼 Bộ sưu tập
            </button>
            <button
              onClick={() => setActiveTab('mint')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors duration-200 ${
                activeTab === 'mint'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🎨 Tạo NFT
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'mint' && (
          <div className="py-12 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Tạo NFT mới</h2>
                <p className="text-gray-600 mb-8">Tạo và mint NFT độc đáo của riêng bạn</p>
                <button 
                  onClick={mintNFT} 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  🎨 Tạo NFT ngay
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'my-nfts' && <MyNFTs />}
        
        {activeTab === 'marketplace' && <MarketplacePage />}
      </main>
    </div>
  );
}