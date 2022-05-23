import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import * as tokenJson from "../artifacts/contracts/Token.sol/MyToken.json";
import { main as deployBallot } from "./deployBallot";
import { writeLogs } from "../utils";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const ADDRESSES = [
  "0x52158524f906C4e10Ad7C9c403e7EE0477468DB3",
  "0x9496BbFdEBf654CE6cca577585C612E7C74Ad7bA",
  "0x14bA0ff855Cc5e478e7E779b3d131F4157A3434D",
  "0xCCc5cdc7BD5f527471944f17e3ad70AC30AfA067",
  "0xAD0751e7109190AE6423fF597D7Fc77090BC7546",
];

const BASE_VOTE_POWER = 10;
const quickFormat = (number: number) =>
  Number(ethers.utils.formatEther(number));

export async function main(tokenAddress: string) {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  writeLogs("Using address", wallet.address);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  writeLogs("Wallet balance", balance);
  if (balance < 0.01) throw new Error("Not enough ether");

  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenJson.abi,
    signer
  );
  writeLogs("Attached token contract interface to address", tokenAddress);

  let mintTx = await tokenContract.mint(
    wallet.address,
    ethers.utils.parseEther((100).toFixed(18))
  );
  await mintTx.wait();
  writeLogs(`MINTING ${100} to ${wallet.address}`, { hash: mintTx.hash });

  let delegateTx = await tokenContract.delegate(wallet.address);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${wallet.address}`, { hash: delegateTx.hash });

  let postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );
  postDelegateVotePower = await tokenContract.getVotes(ADDRESSES[0]);
  writeLogs(
    `VOTING POWER FOR ${ADDRESSES[0]}`,
    quickFormat(postDelegateVotePower)
  );

  mintTx = await tokenContract.mint(
    wallet.address,
    ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18))
  );
  await mintTx.wait();
  writeLogs(`MINTING ${BASE_VOTE_POWER} to ${wallet.address}`, {
    hash: mintTx.hash,
  });

  postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  delegateTx = await tokenContract.delegate(wallet.address);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${wallet.address}`, { hash: delegateTx.hash });

  postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  let sendTx = await tokenContract.transfer(
    ADDRESSES[1],
    ethers.utils.parseEther((3).toFixed(18))
  );
  await sendTx.wait();
  writeLogs(`SENDING ${3} to ${wallet.address}`, { hash: sendTx.hash });

  postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  delegateTx = await tokenContract.delegate(wallet.address);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${wallet.address}`, { hash: delegateTx.hash });

  postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${ADDRESSES[1]}`,
    quickFormat(postDelegateVotePower)
  );

  writeLogs("", "");
}

export async function secondary(tokenAddress: string) {
  let wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  writeLogs("Using address", wallet.address);
  const provider = ethers.providers.getDefaultProvider("ropsten");
  let signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  writeLogs("Wallet balance", balance);
  if (balance < 0.01) throw new Error("Not enough ether");

  let tokenContract = new ethers.Contract(tokenAddress, tokenJson.abi, signer);
  writeLogs("Attached token contract interface to address", tokenAddress);

  let mintTx = await tokenContract.mint(
    wallet.address,
    ethers.utils.parseEther((50).toFixed(18))
  );
  await mintTx.wait();
  writeLogs(`MINTING ${50} to ${ADDRESSES[1]}`, { hash: mintTx.hash });

  let delegateTx = await tokenContract.delegate(wallet.address);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${wallet.address}`, { hash: delegateTx.hash });

  let postDelegateVotePower = await tokenContract.getVotes(wallet.address);
  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  mintTx = await tokenContract.mint(
    ADDRESSES[1],
    ethers.utils.parseEther(BASE_VOTE_POWER.toFixed(18))
  );
  await mintTx.wait();
  writeLogs(`MINTING ${BASE_VOTE_POWER} to ${ADDRESSES[1]}`, {
    hash: mintTx.hash,
  });
  postDelegateVotePower = await tokenContract.getVotes(ADDRESSES[1]);
  writeLogs(
    `VOTING POWER FOR ${ADDRESSES[1]}`,
    quickFormat(postDelegateVotePower)
  );

  wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.ACCOUNT1 ?? EXPOSED_KEY);
  writeLogs("Using address", wallet.address);
  signer = wallet.connect(provider);
  tokenContract = new ethers.Contract(tokenAddress, tokenJson.abi, signer);

  delegateTx = await tokenContract.delegate(ADDRESSES[2]);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${ADDRESSES[2]}`, { hash: delegateTx.hash });
  writeLogs(
    `VOTING POWER FOR ${ADDRESSES[1]}`,
    quickFormat(postDelegateVotePower)
  );
  wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.ACCOUNT3 ?? EXPOSED_KEY);
  writeLogs("Using address", wallet.address);
  signer = wallet.connect(provider);
  tokenContract = new ethers.Contract(tokenAddress, tokenJson.abi, signer);

  delegateTx = await tokenContract.delegate(wallet.address);
  await delegateTx.wait();
  writeLogs(`DELEGATING to ${wallet.address}`, { hash: delegateTx.hash });

  writeLogs(
    `VOTING POWER FOR ${wallet.address}`,
    quickFormat(postDelegateVotePower)
  );

  writeLogs("", "");
}

if (process.argv.length >= 3) {
  main(process.argv[2]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
