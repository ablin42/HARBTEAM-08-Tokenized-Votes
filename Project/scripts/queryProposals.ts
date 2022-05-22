import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../artifacts/contracts/CustomBallot.sol/CustomBallot.json";
import { writeLogs } from "../utils";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

const NUMBER_OF_PROPOSALS = 3;
// ? Could be set using an arg but I kept it simple
// ? Or we could use a function in our ballot contract to keep track of the nb of proposals

export async function main(ballotAddress: string) {
  writeLogs("QUERYING PROPOSALS SCRIPT", "");

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

  const ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  );
  writeLogs("Attached ballot contract interface to address", ballotAddress);

  for (let i = 0; i < NUMBER_OF_PROPOSALS; i++) {
    writeLogs("Fetching proposals", "");
    const PROPOSAL = await ballotContract.proposals(i);
    writeLogs(`Proposal N${i}`, {
      name: ethers.utils.parseBytes32String(PROPOSAL.name),
      voteCount: PROPOSAL.voteCount.toString(),
    });
    writeLogs("", "");
  }

  writeLogs("", "");
}

if (process.argv.length >= 3) {
  main(process.argv[2]).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
