import {isUK} from "@/utils/rules";

export function getObjectConfig() {
    let currNetwork;

    if (typeof window !== "undefined") {
        /* eslint-disable */
        // 这里第一次如果没有网络的情况, 设置为 arbitrumone
        currNetwork = window.localStorage.getItem("currNetwork");
        if (!currNetwork || currNetwork == "undefined") {
            if (isUK()) {
                window.localStorage.setItem("currNetwork", "matic");
            } else {
                window.localStorage.setItem("currNetwork", "mainnet");
                // window.localStorage.setItem("currNetwork", "ctchain_main");
            }
        }
        currNetwork = window.localStorage.getItem("currNetwork");
    }
    let ObjectConfig = {
        hostMap: {
            mainnet: "https://eth-mainnet.g.alchemy.com/v2/3u6LBdwbmJTGv5ZT18Ae6BhoxJDSUynI",
            kovan: "kovan.etherscan.io",
            arbitrumrinkeby: "testnet.arbiscan.io/",
            arbitrumone: "arbiscan.io/",
            jurt: "jubbart-chain.com/",
            matic: "http://polygon-rpc.com",
            ctchain_main: "http://ctblock.cn/blockChain",
            // ctchain_main: "http://localhost:8080/blockChain",
        },
        DATA_PROVIDERS: {
            kovan: "https://kovan-eth.compound.finance",
            mainnet: "https://eth-mainnet.g.alchemy.com/v2/3u6LBdwbmJTGv5ZT18Ae6BhoxJDSUynI",
            arbitrumrinkeby: "https://rinkeby.arbitrum.io/rpc",
            arbitrumone: "https://arb1.arbitrum.io/rpc",
            jurt: "http://139.196.108.73:7575",
            matic: "http://polygon-rpc.com",
            ctchain_main: "http://ctblock.cn/blockChain",
            // ctchain_main: "http://localhost:8080/blockChain",
        },
        NETWORK_MAP: {
            mainnet: 1,
            kovan: 42,
            arbitrumone: 42161,
            arbitrumrinkeby: 421611,
            jurt: 52,
            matic: 137,
            ctchain_main: 27,
        },
        CHAINID_MAP: {
            1: "mainnet",
            42: "kovan",
            42161: "arbitrumone",
            421611: "arbitrumrinkeby",
            52: "jurt",
            137: "matic",
            27: "ctchain_main",
        },
        DEFAULT_NETWORK: currNetwork,
    };
    return ObjectConfig;
}
