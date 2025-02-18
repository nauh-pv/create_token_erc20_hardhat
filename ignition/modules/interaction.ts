import { ethers } from "hardhat";

async function main() {
  const contractAddress = "0x1930117196850baA308845F2E30d47cF03076ce5";

  const lock = (await ethers.getContractAt("Lock", contractAddress)) as any;

  console.log("contractAddress là:", lock.target);

  // 1. Lấy thời gian unlock
  const unlockTime = await lock.unlockTime();
  console.log(
    "⏰ Thời gian unlock:",
    new Date(Number(unlockTime) * 1000).toLocaleString()
  );

  // 2. Kiểm tra xem có đủ điều kiện để rút tiền không
  const currentTime = Math.floor(Date.now() / 1000);
  if (currentTime < Number(unlockTime)) {
    console.log("🚫 Chưa tới thời gian rút tiền!");
    return;
  }

  // 3. Gọi hàm withdraw để rút tiền
  console.log("💸 Đang tiến hành rút tiền...");
  const tx = await lock.withdraw({ gasLimit: 500000 });
  await tx.wait(); // Chờ giao dịch được xác nhận
  console.log("✅ Đã rút tiền thành công!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
