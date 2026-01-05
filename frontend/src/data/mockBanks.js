// src/data/mockBanks.js

export const MOCK_BANKS_DATA = {
  creditCards: [], // Giả lập chưa có thẻ
  banks: [
    {
      id: 1,
      bankName: "Vietcombank",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_Vietcombank.svg", // Link logo mẫu
      accountName: "NGUYEN VAN A",
      branch: "Chi nhánh TP.HCM",
      lastDigits: "9874", // Chỉ lưu 4 số cuối
      isVerified: true,
      isDefault: true
    },
    {
      id: 2,
      bankName: "Techcombank",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/02/Techcombank_logo.png",
      accountName: "NGUYEN VAN A",
      branch: "Chi nhánh Hà Nội",
      lastDigits: "1234",
      isVerified: true,
      isDefault: false
    }
  ]
};