import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { writeLogs } from "../utils";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const quickFormat = (number: number) =>
  Number(ethers.utils.formatEther(number));

export async function main(ballotAddress: string) {
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

  let ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  );
  writeLogs("Attached ballot contract interface to address", ballotAddress);

  let votingPower = quickFormat(
    await ballotContract.votingPower(wallet.address)
  );
  writeLogs(`VOTING POWER FOR ${wallet.address}`, votingPower);
  const voteTx = await ballotContract.vote(0, 50);
  voteTx.wait();
  writeLogs(`VOTED FOR PROPOSAL ${0} WITH ${50}`, {hash: voteTx.hash});
  writeLogs(
    `SPENT VOTING POWER FOR ${wallet.address}`,
    quickFormat(await ballotContract.spentVotePower(wallet.address))
  );
  const winningProposal = await ballotContract.winnerName();
  writeLogs(`WINNING PROPOSAL`, winningProposal);

  writeLogs("", "");
}

export async function secondary(ballotAddress: string) {
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

  let ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  );
  writeLogs("Attached ballot contract interface to address", ballotAddress);

  let votingPower = quickFormat(
    await ballotContract.votingPower(wallet.address)
  );
  writeLogs(`VOTING POWER FOR ${wallet.address}`, votingPower);
  let voteTx = await ballotContract.vote(0, 20);
  voteTx.wait();
  writeLogs(`VOTED FOR PROPOSAL ${0} WITH ${20}`, {hash: voteTx.hash});
  writeLogs(
    `SPENT VOTING POWER FOR ${wallet.address}`,
    quickFormat(await ballotContract.spentVotePower(wallet.address))
  );

  wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.ACCOUNT3 ?? EXPOSED_KEY);
  writeLogs("Using address", wallet.address);
  signer = wallet.connect(provider);
  ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  );

  const winningProposal = await ballotContract.winnerName();
  writeLogs(`WINNING PROPOSAL`, winningProposal);
  writeLogs(`VOTING POWER FOR ${wallet.address}`, votingPower);
  voteTx = await ballotContract.vote(0, 10);
  voteTx.wait();
  writeLogs(`VOTED FOR PROPOSAL ${2} WITH ${10}`, {hash: voteTx.hash});
  writeLogs(
    `SPENT VOTING POWER FOR ${wallet.address}`,
    quickFormat(await ballotContract.spentVotePower(wallet.address))
  );

  writeLogs("", "");
}

if (process.argv.length >= 3) {
  main(process.argv[2]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
