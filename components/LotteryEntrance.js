import { contractAddresses, abi } from "../constants"
// dont export from moralis when using react
import { useMoralis, useWeb3Contract, useMoralisWeb3Api } from "react-moralis"
import { useEffect, useState } from "react"
import { CryptoLogos, useNotification } from "web3uikit"
import { ethers } from "ethers"
import Logo from '../public/lottery.png'

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    // console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const Web3Api = useMoralisWeb3Api();
    // State hooks
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfEntrants, setNumberOfEntrants] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [raffleBalance, setRaffleBalance] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    /* View Functions */

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    // function NativeBalance() {
    //     const { getBalances, data: balance, nativeToken, error, isLoading} = useNativeBalance({chain: chainId})
    // }

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getPlayersNumber()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        
        const options = {
            address: raffleAddress,
            
        }

        const balacesCall = await Web3Api.account.getTokenBalances(options);
        
        setRaffleBalance(balance.formatted)
        setEntranceFee(entranceFeeFromCall)
        setNumberOfEntrants(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        console.log(balance.formatted)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // An example filter for listening for events, we will learn more on this next Front end lesson
    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="flex p-5 dark:text-white flex-col items-center justify-between">
            <h1 className="py-4 px-4 font-bold text-3xl place-content-center">Decentralized Lottery Pool</h1>

         
            <img className="w-52 mt-5 mb-10" src="lottery.png"/>
            
            
            {raffleAddress ? (
                <>
                    <button
                        className="bg-violet-600 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                        onClick={async () =>
                            await enterRaffle({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Raffle"
                        )}
                    </button>
                    <div className=" mt-5 dark:bg-slate-600 flex-1 flex-col justify-around items-center rounded-lg px-6 py-6 ring-1 ring-slate-900/5 shadow-xl">
                        <div>Entrance Fee: <div className="pl-5 text-yellow-200">{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div></div>
                        <div>Entrance Fee: <div className="pl-5 text-yellow-200">{ethers.utils.formatUnits(entranceFee, "ether")} ETH</div></div>
                        <div>The current pool size is: <div className="pl-5 text-yellow-200">{numberOfEntrants} Entry Slips</div></div>
                        <div>The most previous winner was: <div className="pl-5 text-yellow-200">{recentWinner}</div></div>
                    </div>
                  
                </>
            ) : (
                <div>Please connect wallet to a supported chain </div>
            )}
        </div>
    )
}