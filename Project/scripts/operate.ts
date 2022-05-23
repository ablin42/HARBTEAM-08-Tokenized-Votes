import { sleep, writeLogs } from "../utils";
import { main as queryProposals } from "./queryProposals";
import { main as deployToken } from "./deployToken";
import { main as deployBallot } from "./deployBallot";
import {
  main as tokenOperations1,
  secondary as tokenOperations2,
} from "./tokenOperations";

import {
  main as ballotFactory1,
  secondary as ballotFactory2,
} from "./ballotFactory";

async function main() {
  writeLogs("OPERATING SCRIPTS", "");
  const tokenAddress = await deployToken();
  writeLogs("Using token at address", { address: tokenAddress });

  writeLogs("Calling 1st part of token operations", {});
  await tokenOperations1(tokenAddress);

  writeLogs("Creating 1st ballot", {});
  let ballotAddress = await deployBallot(tokenAddress); //"0x98f96De15d7493a1aa9c1620a17B96A621cDD845"
  await sleep(1000 * 20);
  writeLogs("Using ballot at address", { address: ballotAddress });
  await queryProposals(ballotAddress);
  await ballotFactory1(ballotAddress);

  writeLogs("Calling 2nd part of token operations", {});
  await tokenOperations2(tokenAddress);
  
  writeLogs("Creating 2nd ballot", {});
  ballotAddress = await deployBallot(tokenAddress);
  await sleep(1000 * 20);
  writeLogs("Using ballot at address", { address: ballotAddress });
  await queryProposals(ballotAddress);
  await ballotFactory2(ballotAddress);

  writeLogs("", "");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
