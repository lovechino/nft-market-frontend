'use client';

export default function ContractSetupGuide() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            🚀 Cần deploy contracts để sử dụng đầy đủ tính năng
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">1. Deploy NFT Contract</h4>
              <p className="text-sm text-gray-600 mb-2">
                Contract để mint và quản lý NFT
              </p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                <div className="text-gray-500">// Truffle/Hardhat</div>
                <div>npx hardhat run scripts/deploy.js --network localhost</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">2. Deploy Marketplace Contract</h4>
              <p className="text-sm text-gray-600 mb-2">
                Contract để mua bán NFT trên marketplace
              </p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                <div className="text-gray-500">// Truffle/Hardhat</div>
                <div>npx hardhat run scripts/deploy-marketplace.js --network localhost</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">3. Cấu hình Environment Variables</h4>
              <p className="text-sm text-gray-600 mb-2">
                Tạo file .env.local với địa chỉ contracts
              </p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono">
                <div>NEXT_PUBLIC_NFT_ADDRESS=0x...</div>
                <div>NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">4. Restart ứng dụng</h4>
              <p className="text-sm text-gray-600">
                Sau khi cấu hình xong, restart development server
              </p>
              <div className="bg-gray-50 rounded p-2 text-xs font-mono mt-2">
                npm run dev
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Hiện tại bạn vẫn có thể mint NFT, nhưng chưa thể mua bán trên marketplace cho đến khi deploy contracts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

