import React from "react";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/export";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const [entranceFee, setEntranceFee] = useState("0");
  const [playerCount, setPlayerCount] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0")
  const dispatch = useNotification();

  const handleNewNotification = function () {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };
  const handleSuccess = async function (tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  };
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });
  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        const entranceFeeContract = (await getEntranceFee()).toString();
        const enteredPlayerCount = (await getNumberOfPlayers()).toString();
        const lotteryRecentWinner = (await getRecentWinner()).toString();
        setEntranceFee(entranceFeeContract);
        setPlayerCount(enteredPlayerCount);
        setRecentWinner(lotteryRecentWinner);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);
  const { runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });

  
  return (
    <div className="p-10">
      Hi from lottery entrance!
      {raffleAddress ? (
        <div>
          <div className="text-xl font-semibold mb-4">
            <div>
            Lottery EntranceFee is{" "}
            {ethers.utils.formatUnits(entranceFee, "ether")} ETH
            </div>
            <div>
            Entererd Lottery player: {playerCount}
            </div>
            <div>
            Lottery Recent Winner: {recentWinner}
            </div>
          </div>
          <button
             disabled={isLoading || isFetching}
           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async function () {
              await enterRaffle({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              });
            }}
          >
           
           {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
           
          </button>
        </div>
      ) : (
        <div>No Lottery Contract is Detected</div>
      )}
    </div>
  );
}

export default LotteryEntrance;
