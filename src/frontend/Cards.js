import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import "./Style/Cards.css";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { sequence } from "0xsequence";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";

const providerOptions = {
	coinbasewallet: {
		package: CoinbaseWalletSDK,
		options: {
			appName: "Wallet Connection",
			infuraId: process.env.INFURA_KEY,
		},
	},
	sequence: {
		package: sequence, // required
		options: {
			appName: "Wallet Connection", // optional
			defaultNetwork: "polygon", // optional
		},
	},
	burnerconnect: {
		package: BurnerConnectProvider, // required
		options: {
			defaultNetwork: "100",
		},
	},
};

const web3Modal = new Web3Modal({
	providerOptions,
	theme: "dark",
});

const Cards = () => {
	const [provider, setProvider] = useState();
	const [account, setAccount] = useState();

	const connectWallet = async () => {
		try {
			const provider = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			const accounts = await library.listAccounts();

			setProvider(provider);

			if (accounts) setAccount(accounts[0]);
		} catch (error) {
			console.error(error);
		}
	};

	const refreshState = () => {
		setAccount();
	};

	const disconnect = async () => {
		await web3Modal.clearCachedProvider();

		refreshState();
	};

	useEffect(() => {
		if (web3Modal.cachedProvider) {
			connectWallet();
		}
	}, []);

	useEffect(() => {
		if (provider?.on) {
			const handleAccountsChanged = (accounts) => {
				console.log("accountsChanged", accounts);
				if (accounts) setAccount(accounts[0]);
			};

			const handleDisconnect = () => {
				disconnect();
			};

			provider.on("disconnect", handleDisconnect);

			return () => {
				if (provider.removeListener) {
					provider.removeListener("accountsChanged", handleAccountsChanged);
					provider.removeListener("disconnect", handleDisconnect);
				}
			};
		}
	}, [provider]);

	return (
		<div>
			<Card className="cards">
				<Card.Header>HEY !!!</Card.Header>
				<Card.Body>
					<Card.Title>Wallet Connection :)</Card.Title>
					<Card.Text>
						You can connect to different Wallets using this "Connect" button
					</Card.Text>
					{!account ? (
						<Button onClick={connectWallet} variant="dark">
							Connect
						</Button>
					) : (
						<Button variant="dark" onClick={disconnect} className="mb-2">
							Disconnect
						</Button>
					)}
					{account ? (
						<div>
							Account: {account.slice(0, 5) + "..." + account.slice(38, 42)}
						</div>
					) : null}
				</Card.Body>
				<Card.Footer className="text-muted">See Ya !!!</Card.Footer>
			</Card>
		</div>
	);
};

export default Cards;
