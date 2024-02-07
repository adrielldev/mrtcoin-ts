import * as CryptoJS from 'crypto-js';

export class Block {

    public index: number;
    public hash: string;
    public previousHash: string;
    public timestamp: number;
    public data: string;

    constructor(index: number, hash: string, previousHash: string, timestamp: number, data: string) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }

  
}

const genesisBlock:Block = new Block(
    0,'816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7','',1465154705,'my genesis block'
)

let blockchain: Block[] = [genesisBlock];

export const getBlockchain = ():Block[] => blockchain;

export const getLatestBlock = ():Block => blockchain[blockchain.length - 1]


export const generateNextBlock = (blockData:string):Block => {
    const previousBlock: Block = getLatestBlock()
    const nextIndex:number = previousBlock.index + 1;
    const nextTimeStamp:number = new Date().getTime() / 1000;
    const nextHash: string = calculateHash(nextIndex,previousBlock.hash,nextTimeStamp,blockData);
    const newBlock: Block = new Block(nextIndex,nextHash,previousBlock.hash,nextTimeStamp,blockData)
    return newBlock;
}   

const calculateHash = (index:number,previousHash:string,timestamp:number,data:string):string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

const calculateHashForBlock = (block:Block):string => calculateHash(block.index,block.previousHash,block.timestamp,block.data);

const addBlock = (newBlock:Block) =>{
    if(isValidNewBlock(newBlock,getLatestBlock())) {
        blockchain.push(newBlock)
    }
}

export const isValidBlockStructure = (block: Block): boolean => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};


const isValidNewBlock = (newBlock:Block,previousBlock:Block) => {

    if (!isValidBlockStructure(newBlock)) {
        console.log('invalid structure');
        return false;
    }

    if(previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index')
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash')
        return false;
    }
    else if(calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log('invalid hash')
        return false;
    }
    return true;

} 

const isValidChain = (blockchainToValidate:Block[]): boolean => {
    const isValidGenesis = (block:Block): boolean => {
        return JSON.stringify(block) == JSON.stringify(genesisBlock)
    }
    if(!isValidGenesis(blockchainToValidate[0])) {
        return false
    }

    for(let i =0 ; i< blockchainToValidate.length; i++) {
        if(!isValidNewBlock(blockchainToValidate[i],blockchainToValidate[i-1])){
            return false;
        }
    }
    return true;

}

export const addBlockToChain = (newBlock:Block):boolean => {
    if(isValidNewBlock(newBlock,getLatestBlock())){
        blockchain.push(newBlock);
        return true;
    }
    return false;
}

export const replaceChain = (newBlocks:Block[]) => {
    if(isValidChain(newBlocks) && newBlocks.length > getBlockchain().length) {
        console.log('Received blockchain is valid. replacing current blockchain with received blockchain')
        blockchain = newBlocks; 
        // broadcastLatest();
        
    } else {
        console.log('received blockchain is invalid')
    }
}