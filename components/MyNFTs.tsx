"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getNFTContract } from "@/hooks/nft";
import { useWallet } from "@/lib/useWallet";

interface NFTItem {
  tokenId: string;
  tokenURI: string;
}

export default function MyNFTs() {
  const { address } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadNFTs = async () => {
      if (!address) return;
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        const contract = getNFTContract(provider);

        const myNFTs: NFTItem[] = [];

        // Giả sử NFT có tối đa 50 tokenId
        for (let tokenId = 1; tokenId <= 50; tokenId++) {
          try {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === address.toLowerCase()) {
              const tokenURI = await contract.tokenURI(tokenId);
              myNFTs.push({ tokenId: tokenId.toString(), tokenURI });
            }
          } catch {
            // Bỏ qua tokenId không tồn tại
          }
        }

        setNfts(myNFTs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [address]);

  const filteredNFTs = nfts.filter(nft => 
    nft.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!address) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết nối ví để xem NFT</h2>
            <p className="text-gray-600">Vui lòng kết nối ví MetaMask để xem bộ sưu tập NFT của bạn</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Bộ sưu tập của tôi</h1>
              <p className="text-gray-600">Quản lý và xem NFT trong bộ sưu tập của bạn</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold">
              {nfts.length} NFT
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {nfts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm NFT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
        )}

        {/* Results */}
        {nfts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Bộ sưu tập trống</h3>
              <p className="text-gray-600 mb-8">Bạn chưa sở hữu NFT nào. Hãy tạo hoặc mua NFT đầu tiên!</p>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">💡 Gợi ý</h4>
                <div className="text-purple-700 space-y-2 text-sm">
                  <p>• Tạo NFT mới ở tab "Tạo NFT"</p>
                  <p>• Mua NFT từ marketplace</p>
                  <p>• NFT sẽ xuất hiện ở đây</p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredNFTs.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy NFT</h3>
              <p className="text-gray-600 mb-8">Không có NFT nào khớp với từ khóa tìm kiếm</p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((nft) => (
              <div key={nft.tokenId} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={nft.tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")}
                    alt={`NFT #${nft.tokenId}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2NS40NjQgMTAwIDE3Ny41IDEwOC4wMzYgMTc3LjUgMTE4LjVWMTgxLjVDMTc3LjUgMTkxLjk2NCAxNjUuNDY0IDIwMCAxNTAgMjAwQzEzNC41MzYgMjAwIDEyMi41IDE5MS45NjQgMTIyLjUgMTgxLjVWMTE4LjVDMTIyLjUgMTA4LjAzNiAxMzQuNTM2IDEwMCAxNTAgMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                      <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Token ID Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                    #{nft.tokenId}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Token #{nft.tokenId}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Sở hữu</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <p>Bộ sưu tập cá nhân</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
