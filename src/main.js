import { AlchemyProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import env from "dotenv";
env.config();


const testBuy = async() => {

    //RPC Provider
    const provider = new AlchemyProvider("goerli", process.env.ETH_ALCHEMY_API_KEY); //FIXME update link provider from package. NPM INSTALL will fail: eth-goerli.g.alchemyapi.io/v2/ <- UPDATE LINK PROVIDER
  
    const walletSigner = await new ethers.Wallet( //This wallet it's geted by metamask 
        process.env.SIGNER_PRIVATE_KEY,
        provider
      );

      //CONTRACT ABIs This arrays have the human readable functions that will be called throught the UI
      const marketAbi = [
        "function buyProduct(uint _id) public virtual", //Buy product
        "function getClientPurchases(address _account) public", //Get the client purchases
        "function tokenAddress() public view", //Get the contract address where the token lives
        "function getTreasury() public" //Get the marketplace treasury account 
      ];

      const tokenAbi = [
        "function approve(address spender, uint256 amount) public " //This function allows the marketplace contract to process user token payment
      ]

      //The Market contract has 3 products loaded: 
      // ID:0 name:"Test Product 1" price: 500 NST
      // ID:1 name:"Test Product 2" price: 1000 NST
      // ID:2 name:"Test Product 3" price: 1500 NST
    
      const tokenAddress = process.env.TOKEN_ADDRESS; //Token contract address
      const marketAddress = process.env.MARKET_ADDRESS; //Marketplace contract address

      const productPriceExample = 500 //<- This is the price for the "Test Product 1" product in the marketplace

      //CONTRACT INSTANCES
      const ensTokenContract = await new ethers.Contract(tokenAddress, tokenAbi, walletSigner);
      const marketContract = await new ethers.Contract(marketAddress, marketAbi, walletSigner);

      //FUNCTIONS CALLED BY CLIENT IN UI
      await ensTokenContract.approve( marketAddress, productPriceExample ); //This function is called by the client. Allows the token payment
      await marketContract.buyProduct(0); //This fuctions is called by client. Receive only the product id for purchase. The client should have the product price as minimum in their balance


}
