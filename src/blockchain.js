"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceChain = exports.addBlockToChain = exports.isValidBlockStructure = exports.generateNextBlock = exports.getLatestBlock = exports.getBlockchain = exports.Block = void 0;
const CryptoJS = __importStar(require("crypto-js"));
class Block {
    constructor(index, hash, previousHash, timestamp, data) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash;
    }
}
exports.Block = Block;
const genesisBlock = new Block(0, '816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7', '', 1465154705, 'my genesis block');
let blockchain = [genesisBlock];
const getBlockchain = () => blockchain;
exports.getBlockchain = getBlockchain;
const getLatestBlock = () => blockchain[blockchain.length - 1];
exports.getLatestBlock = getLatestBlock;
const generateNextBlock = (blockData) => {
    const previousBlock = (0, exports.getLatestBlock)();
    const nextIndex = previousBlock.index + 1;
    const nextTimeStamp = new Date().getTime() / 1000;
    const nextHash = calculateHash(nextIndex, previousBlock.hash, nextTimeStamp, blockData);
    const newBlock = new Block(nextIndex, nextHash, previousBlock.hash, nextTimeStamp, blockData);
    return newBlock;
};
exports.generateNextBlock = generateNextBlock;
const calculateHash = (index, previousHash, timestamp, data) => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
const calculateHashForBlock = (block) => calculateHash(block.index, block.previousHash, block.timestamp, block.data);
const addBlock = (newBlock) => {
    if (isValidNewBlock(newBlock, (0, exports.getLatestBlock)())) {
        blockchain.push(newBlock);
    }
};
const isValidBlockStructure = (block) => {
    return typeof block.index === 'number'
        && typeof block.hash === 'string'
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string';
};
exports.isValidBlockStructure = isValidBlockStructure;
const isValidNewBlock = (newBlock, previousBlock) => {
    if (!(0, exports.isValidBlockStructure)(newBlock)) {
        console.log('invalid structure');
        return false;
    }
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    }
    else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previous hash');
        return false;
    }
    else if (calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log('invalid hash');
        return false;
    }
    return true;
};
const isValidChain = (blockchainToValidate) => {
    const isValidGenesis = (block) => {
        return JSON.stringify(block) == JSON.stringify(genesisBlock);
    };
    if (!isValidGenesis(blockchainToValidate[0])) {
        return false;
    }
    for (let i = 0; i < blockchainToValidate.length; i++) {
        if (!isValidNewBlock(blockchainToValidate[i], blockchainToValidate[i - 1])) {
            return false;
        }
    }
    return true;
};
const addBlockToChain = (newBlock) => {
    if (isValidNewBlock(newBlock, (0, exports.getLatestBlock)())) {
        blockchain.push(newBlock);
        return true;
    }
    return false;
};
exports.addBlockToChain = addBlockToChain;
const replaceChain = (newBlocks) => {
    if (isValidChain(newBlocks) && newBlocks.length > (0, exports.getBlockchain)().length) {
        console.log('Received blockchain is valid. replacing current blockchain with received blockchain');
        blockchain = newBlocks;
        // broadcastLatest();
    }
    else {
        console.log('received blockchain is invalid');
    }
};
exports.replaceChain = replaceChain;
