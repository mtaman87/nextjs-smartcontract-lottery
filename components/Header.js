import { ConnectButton } from "@web3uikit/web3"

export default function Header() {
    return (
        <div className="py-10 flex justify-end" >
            
            <ConnectButton moralisAuth={false}/>
        </div>
    )
}