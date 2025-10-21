"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getMarketplaceContract } from "@/hooks/marketplace";
import { getNFTContract } from "@/hooks/nft";
import ContractSetupGuide from "./ContractSetupGuide";
import { useWallet } from "@/lib/useWallet";

interface Listing {
  id: string;
  seller: string;
  tokenId: string;
  price: string;
  nftContract: string;
  tokenURI: string;
}

export default function MarketplacePage() {
  const { address } = useWallet();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-low");

  const loadMarketNFTs = async () => {
    setLoading(true);
    try {
      // Kiểm tra xem có cấu hình contract address không
      if (!process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS) {
        console.log('Marketplace contract address not configured');
        setListings([]);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum!);
      console.log(provider.getNetwork)
      const market = getMarketplaceContract(provider);
      console.log(market)
      // Kiểm tra xem contract có tồn tại không bằng cách gọi một method đơn giản
      try {
        // Thử gọi một method view đơn giản trước
        const nftAddress = "0x22FB726b8f1C1Eef3644B2ee73aA943AF98d2414";
        const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1);
        const data = await market.getAllListings(nftAddress, [1]);
        console.log("📦 Listings data:", data);
        
        if (!data || data.length === 0) {
          setListings([]);
          return;
        }

        const items: Listing[] = await Promise.all(
          data.map(async (l: any) => {
            const nftContract = getNFTContract(provider);
            const tokenURI = await nftContract.tokenURI(l.tokenId);
            return {
              id: l.id.toString(),
              seller: l.seller,
              tokenId: l.tokenId.toString(),
              price: ethers.formatEther(l.price),
              nftContract: l.nftContract,
              tokenURI,
            };
          })
        );

        setListings(items);
      } catch (contractError: any) {
        console.error('Contract error:', contractError);
        
        // Nếu contract chưa được deploy hoặc không có listings
        if (contractError.code === 'BAD_DATA' || 
            contractError.message?.includes('could not decode') ||
            contractError.message?.includes('execution reverted') ||
            contractError.code === 'CALL_EXCEPTION') {
          console.log('Contract not deployed or no listings available');
          setListings([]);
        } else {
          throw contractError;
        }
      }
    } catch (err) {
      console.error('General error:', err);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId: string, price: string) => {
    if (!address) return alert("Hãy kết nối ví!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum!);
      const signer = await provider.getSigner();
      const market = getMarketplaceContract(signer);
      const tx = await market.buyNFT(listingId, { value: ethers.parseEther(price) });
      await tx.wait();
      alert("🎉 Mua thành công!");
      loadMarketNFTs();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi mua NFT");
    }
  };

  const filteredListings = listings.filter(listing => 
    listing.tokenId.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

  useEffect(() => {
    loadMarketNFTs();
  }, []);

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
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Khám phá NFT</h1>
          <p className="text-gray-600">Khám phá và sưu tập những NFT độc đáo từ cộng đồng</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
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

            {/* Sort */}
            <div className="md:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
              >
                <option value="price-low">Giá: Thấp → Cao</option>
                <option value="price-high">Giá: Cao → Thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chưa có NFT nào</h3>
              <p className="text-gray-600 mb-8">Thị trường chưa có NFT nào đang được bán</p>
              {!process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS ? (
                <ContractSetupGuide />
              ) : (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-purple-800 mb-3">🚀 Bắt đầu ngay</h4>
                  <div className="text-purple-700 space-y-2 text-sm">
                    <p>1. Tạo NFT mới ở tab "Tạo NFT"</p>
                    <p>2. List NFT lên marketplace</p>
                    <p>3. NFT sẽ xuất hiện ở đây</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((nft) => (
              <div key={nft.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1">
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
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Token #{nft.tokenId}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Đang bán</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Giá</p>
                      <p className="text-lg font-bold text-gray-900">{nft.price} ETH</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Người bán</p>
                      <p className="text-sm font-medium text-gray-700">{nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuy(nft.id, nft.price)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Mua ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
