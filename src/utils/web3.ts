import { ethers } from 'ethers';
import RPS_ABI from '../contracts/RPS.json';
import { RPS_BYTECODE, Move } from '../contracts/contractConfig';

// Check if MetaMask is installed
export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

// Connect to MetaMask
export async function connectWallet(): Promise<string> {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  const accounts = await window.ethereum.request({ 
    method: 'eth_requestAccounts' 
  });
  
  return accounts[0];
}

// Get current network
export async function getNetwork(): Promise<ethers.Network> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getNetwork();
}

// Switch to Sepolia network
export async function switchToSepolia(): Promise<void> {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
    });
  } catch (error: any) {
    // If the chain has not been added to MetaMask
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'SEP',
              decimals: 18,
            },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

// Deploy a new RPS contract
export async function deployRPSContract(
  commitment: string,
  player2Address: string,
  stakeAmount: bigint
): Promise<string> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  const factory = new ethers.ContractFactory(RPS_ABI, RPS_BYTECODE, signer);
  const contract = await factory.deploy(commitment, player2Address, {
    value: stakeAmount,
  });
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  
  return address;
}

// Get contract instance
export function getContract(contractAddress: string, signer?: ethers.Signer): ethers.Contract {
  const provider = new ethers.BrowserProvider(window.ethereum);
  
  if (signer) {
    return new ethers.Contract(contractAddress, RPS_ABI, signer);
  }
  
  return new ethers.Contract(contractAddress, RPS_ABI, provider);
}

// Get contract state
export interface ContractState {
  j1: string;
  j2: string;
  c1Hash: string;
  c2: Move;
  stake: bigint;
  timeout: bigint;
  lastAction: bigint;
}

export async function getContractState(contractAddress: string): Promise<ContractState> {
  const contract = getContract(contractAddress);
  
  const [j1, j2, c1Hash, c2, stake, timeout, lastAction] = await Promise.all([
    contract.j1(),
    contract.j2(),
    contract.c1Hash(),
    contract.c2(),
    contract.stake(),
    contract.TIMEOUT(),
    contract.lastAction(),
  ]);
  
  return {
    j1,
    j2,
    c1Hash,
    c2: Number(c2),
    stake,
    timeout,
    lastAction,
  };
}

// Player 2 plays their move
export async function playMove(
  contractAddress: string,
  move: Move,
  stakeAmount: bigint
): Promise<ethers.TransactionReceipt> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getContract(contractAddress, signer);
  
  const tx = await contract.play(move, { value: stakeAmount });
  return await tx.wait();
}

// Player 1 reveals their move
export async function revealMove(
  contractAddress: string,
  move: Move,
  salt: string
): Promise<ethers.TransactionReceipt> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getContract(contractAddress, signer);
  
  const tx = await contract.solve(move, salt);
  return await tx.wait();
}

// Call j1Timeout (Player 2 can claim if Player 1 doesn't reveal)
export async function callJ1Timeout(contractAddress: string): Promise<ethers.TransactionReceipt> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getContract(contractAddress, signer);
  
  const tx = await contract.j1Timeout();
  return await tx.wait();
}

// Call j2Timeout (Player 1 can claim if Player 2 doesn't play)
export async function callJ2Timeout(contractAddress: string): Promise<ethers.TransactionReceipt> {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = getContract(contractAddress, signer);
  
  const tx = await contract.j2Timeout();
  return await tx.wait();
}

// Get current account
export async function getCurrentAccount(): Promise<string | null> {
  if (!isMetaMaskInstalled()) return null;
  
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0] || null;
}

// Listen for account changes
export function onAccountChange(callback: (accounts: string[]) => void): void {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
}

// Listen for network changes
export function onNetworkChange(callback: () => void): void {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}
