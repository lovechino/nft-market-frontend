import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getNFTContract } from "@/hooks/nft";
import { getMarketplaceContract } from "@/hooks/marketplace";

const MarketplacePage = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<number | null>(null);

  const nftAddress = "0x22FB726b8f1C1Eef3644B2ee73aA943AF98d2414";

  const loadMarketNFTs = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const market = getMarketplaceContract(provider);

      const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1);
      const data = await market.getAllListings(nftAddress, tokenIds);

      console.log("📦 Listings data:", data);

      const listings = data
        .map((l: any, index: number) => ({
          tokenId: tokenIds[index],
          seller: l[0],
          price: l[1],
        }))
        .filter(
          (item: any) =>
            item.seller !== "0x0000000000000000000000000000000000000000"
        );

      const nftContract = getNFTContract(provider);
      const nftDetails = await Promise.all(
        listings.map(async (l: any) => {
          try {
            const tokenURI = await nftContract.tokenURI(l.tokenId);
            if (!tokenURI || tokenURI === "ipfs://QmABC123xyz") {
              console.warn("⚠️ Bỏ qua tokenURI không hợp lệ:", tokenURI);
              return null;
            }

            console.log("🔗 tokenURI:", tokenURI);
            const url = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

            let metadata = {
              name: `NFT #${l.tokenId}`,
              description: "Hình ảnh NFT trực tiếp từ IPFS",
              image: url,
            };

            try {
              const res = await fetch(url);
              const text = await res.text();

              if (text.startsWith("{")) {
                const parsed = JSON.parse(text);
                metadata = {
                  name: parsed.name || metadata.name,
                  description:
                    parsed.description || metadata.description,
                  image:
                    parsed.image?.replace("ipfs://", "https://ipfs.io/ipfs/") ||
                    metadata.image,
                };
              } else {
                console.warn("⚠️ TokenURI là ảnh, không phải JSON:", url);
              }
            } catch (err) {
              console.warn("⚠️ Không thể fetch metadata:", err);
            }

            return {
              tokenId: l.tokenId,
              seller: l.seller,
              price: Number(l.price) / 1e18,
              name: metadata.name,
              image: metadata.image,
              description: metadata.description,
            };
          } catch (err) {
            console.error("❌ Lỗi khi load metadata:", err);
            return null;
          }
        })
      );

      const filtered = nftDetails.filter((n) => n !== null);
      setNfts(filtered);
    } catch (error) {
      console.error("❗ Lỗi loadMarketNFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Hàm mua NFT
  const handleBuyNFT = async (tokenId: number, price: number) => {
    try {
      setBuying(tokenId);
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const market = getMarketplaceContract(signer);

      const tx = await market.buyNFT(nftAddress, tokenId, {
        value: ethers.parseEther(price.toString()),
      });

      console.log("🛍️ Giao dịch đang gửi:", tx.hash);
      await tx.wait();
      alert(`✅ Mua thành công NFT #${tokenId}!`);

      loadMarketNFTs();
    } catch (error: any) {
      console.error("❌ Lỗi khi mua NFT:", error);
      alert("Vui lòng kiểm tra lại số dư");
    } finally {
      setBuying(null);
    }
  };

  useEffect(() => {
    loadMarketNFTs();
  }, []);

  if (loading) return <p>⏳ Đang tải danh sách NFT...</p>;
  if (nfts.length === 0) return <p>❌ Không có NFT nào đang được bán.</p>;

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {nfts.map((nft) => (
        <div
          key={nft.tokenId}
          className="p-4 rounded-2xl shadow-md bg-white hover:shadow-lg transition"
        >
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full h-60 object-cover rounded-xl mb-3"
          />
          <h3 className="text-lg font-semibold">{nft.name}</h3>
          <p className="text-sm text-gray-600">{nft.description}</p>
          <p className="mt-2 text-indigo-600 font-bold">💰 {nft.price} ETH</p>
          <p className="text-xs text-gray-400">
            Người bán: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
          </p>

          <button
            onClick={() => handleBuyNFT(nft.tokenId, nft.price)}
            disabled={buying === nft.tokenId}
            className={`mt-3 w-full py-2 rounded-xl text-white font-semibold transition ${
              buying === nft.tokenId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {buying === nft.tokenId ? "⏳ Đang mua..." : "🛒 Mua ngay"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default MarketplacePage;
