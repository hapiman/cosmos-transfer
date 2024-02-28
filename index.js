const { DirectSecp256k1Wallet } = require("@cosmjs/proto-signing");
const { Registry, defaultRegistryTypes } = require("@cosmjs/proto-signing");
const { assertIsBroadcastTxSuccess, SigningStargateClient, coins } = require("@cosmjs/stargate");

// 替换以下值为实际的发送者钱包信息和接收者地址
const mnemonic = "your mnemonic here"; // 发送者的助记词
const recipientAddress = "cosmos1xxx..."; // 接收者的地址
const rpcEndpoint = "http://localhost:26657"; // Cosmos SDK 节点的 RPC 端口

(async () => {
    // 创建钱包
    const wallet = await DirectSecp256k1Wallet.fromMnemonic(mnemonic, { prefix: "cosmos" });
    
    // 获取发送者地址
    const [firstAccount] = await wallet.getAccounts();
    const senderAddress = firstAccount.address;

    // 创建签名客户端
    const registry = new Registry(defaultRegistryTypes);
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry });

    // 构建并广播转账交易
    const amount = coins(1000000, "uatom"); // 1000000uatom 等于 1 Atom
    const fee = {
        amount: coins(5000, "uatom"), // 交易费用
        gas: "200000", // Gas 限制
    };
    const memo = "Test transfer"; // 交易附言

    const result = await client.sendTokens(senderAddress, recipientAddress, amount, fee, memo);

    // 检查交易是否成功
    assertIsBroadcastTxSuccess(result);
    console.log("Successfully transferred tokens:", result);
})().catch(console.error);
