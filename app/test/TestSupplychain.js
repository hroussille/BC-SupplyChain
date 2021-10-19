// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions');

const itemStates = {
    Harvested: 0,
    Processed: 1,
    Packed: 2,
    ForSale: 3,
    Sold: 4,
    Shipped: 5,
    Received: 6,
    Purchased: 7
}

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli;
    var sku = 1
    var upc = 1
    const ownerID = accounts[0]
    const originFarmerID = accounts[1]
    const originFarmName = "John Doe"
    const originFarmInformation = "Yarray Valley"
    const originFarmLatitude = "-38.239770"
    const originFarmLongitude = "144.341490"
    var productID = sku + upc
    const productNotes = "Best beans for Espresso"
    const productPrice = web3.utils.toWei('1', "ether")
    var itemState = 0
    const distributorID = accounts[2]
    const retailerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    ///Available Accounts
    ///==================
    ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
    ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
    ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
    ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
    ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
    ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
    ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
    ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
    ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
    ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[0] ", accounts[0])
    console.log("Farmer: accounts[1] ", accounts[1])
    console.log("Distributor: accounts[2] ", accounts[2])
    console.log("Retailer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    it("Testing that an account can be added to the FarmerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addFarmer(originFarmerID)

        truffleAssert.eventEmitted(tx_add, 'FarmerAdded', (ev) => {
            return ev.account == originFarmerID;
        });

        let tx_check = await supplyChain.isFarmer(originFarmerID)

        assert.equal(tx_check, true)
    })

    it("Testing that an account can be added to the DistributorRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addDistributor(distributorID)

        truffleAssert.eventEmitted(tx_add, 'DistributorAdded', (ev) => {
            return ev.account == distributorID;
        });

        let tx_check = await supplyChain.isDistributor(distributorID)

        assert.equal(tx_check, true)
    })

    it("Testing that an account can be added to the RetailerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addRetailer(retailerID)

        truffleAssert.eventEmitted(tx_add, 'RetailerAdded', (ev) => {
            return ev.account == retailerID;
        });

        let tx_check = await supplyChain.isRetailer(retailerID)

        assert.equal(tx_check, true)
    })

    it("Testing that an account can be added to the ConsumerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.addConsumer(consumerID)

        truffleAssert.eventEmitted(tx_add, 'ConsumerAdded', (ev) => {
            return ev.account == consumerID;
        });

        let tx_check = await supplyChain.isConsumer(consumerID)

        assert.equal(tx_check, true)
    })

    // 1st Test
    it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
        
        let tx = await supplyChain.harvestItem(upc, originFarmerID, originFarmName, originFarmInformation, originFarmLatitude, originFarmLongitude, productNotes)
        
        truffleAssert.eventEmitted(tx, 'Harvested', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Harvested, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 2nd Test
    it("Testing smart contract function processItem() that allows a farmer to process coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
         // Declare and Initialize a variable for event
         var eventEmitted = false
        
         let tx = await supplyChain.processItem(upc, {from: originFarmerID})
         
         truffleAssert.eventEmitted(tx, 'Processed', (ev) => {
             eventEmitted = true;
             return ev.upc == upc;
         });
 
         // Retrieve the just now saved item from blockchain by calling function fetchItem()
         const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
         const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
 
         // Verify the result set
         assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
         assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
         assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
         assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
         assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
         assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
         assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
         assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
         assert.equal(resultBufferTwo[5], itemStates.Processed, 'Error: Invalid item State')
         assert.equal(eventEmitted, true, 'Invalid event emitted')        
    })    

    // 3rd Test
    it("Testing smart contract function packItem() that allows a farmer to pack coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.packItem(upc, {from: originFarmerID})
        
        truffleAssert.eventEmitted(tx, 'Packed', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Packed, 'Error: Invalid item State')
        assert.equal(eventEmitted, true, 'Invalid event emitted')         
    })    

    // 4th Test
    it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.sellItem(upc, productPrice, {from: originFarmerID})
        
        truffleAssert.eventEmitted(tx, 'ForSale', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], originFarmerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.ForSale, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(eventEmitted, true, 'Invalid event emitted')  
    })    

    // 5th Test
    it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async() => {
        const supplyChain = await SupplyChain.deployed()
        
        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.buyItem(upc, {from: distributorID, value: productPrice})
        
        truffleAssert.eventEmitted(tx, 'Sold', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Sold, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
    })    

    // 6th Test
    it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.shipItem(upc, {from: distributorID})
        
        truffleAssert.eventEmitted(tx, 'Shipped', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], distributorID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Shipped, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(eventEmitted, true, 'Invalid event emitted')
    })    

    // 7th Test
    it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.receiveItem(upc, {from: retailerID})
        
        truffleAssert.eventEmitted(tx, 'Received', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], retailerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Received, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(resultBufferTwo[7], retailerID, "Error: Invalid retailer")
        assert.equal(eventEmitted, true, 'Invalid event emitted')          
    })    

    // 8th Test
    it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Declare and Initialize a variable for event
        var eventEmitted = false
       
        let tx = await supplyChain.purchaseItem(upc, {from: consumerID})
        
        truffleAssert.eventEmitted(tx, 'Purchased', (ev) => {
            eventEmitted = true;
            return ev.upc == upc;
        });

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
        assert.equal(resultBufferTwo[5], itemStates.Purchased, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(resultBufferTwo[7], retailerID, "Error: Invalid retailer")
        assert.equal(resultBufferTwo[8], consumerID, "Error: Invalid consumer")
        assert.equal(eventEmitted, true, 'Invalid event emitted') 
    })    

    // 9th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originFarmerID, 'Error: Missing or Invalid originFarmerID')
        assert.equal(resultBufferOne[4], originFarmName, 'Error: Missing or Invalid originFarmName')
        assert.equal(resultBufferOne[5], originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
        assert.equal(resultBufferOne[6], originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
        assert.equal(resultBufferOne[7], originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)
        
        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid product ID')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid product Notes')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[5], itemStates.Purchased, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], distributorID, "Error: Invalid distributor.")
        assert.equal(resultBufferTwo[7], retailerID, "Error: Invalid retailer")
        assert.equal(resultBufferTwo[8], consumerID, "Error: Invalid consumer")
    })

    it("Testing that an account can be removed from the FarmerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.renounceFarmer({from: originFarmerID})

        truffleAssert.eventEmitted(tx_add, 'FarmerRemoved', (ev) => {
            return ev.account == originFarmerID;
        });

        let tx_check = await supplyChain.isFarmer(originFarmerID)

        assert.equal(tx_check, false)
    })

    it("Testing that an account can be removed from the DistributorRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.renounceDistributor({from: distributorID})

        truffleAssert.eventEmitted(tx_add, 'DistributorRemoved', (ev) => {
            return ev.account == distributorID;
        });

        let tx_check = await supplyChain.isDistributor(distributorID)

        assert.equal(tx_check, false)
    })

    it("Testing that an account can be removed from the RetailerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.renounceRetailer({from: retailerID})

        truffleAssert.eventEmitted(tx_add, 'RetailerRemoved', (ev) => {
            return ev.account == retailerID;
        });

        let tx_check = await supplyChain.isRetailer(retailerID)

        assert.equal(tx_check, false)
    })

    it("Testing that an account can be removed from the ConsumerRole", async() => {
        const supplyChain = await SupplyChain.deployed()

        let tx_add = await supplyChain.renounceConsumer({from: consumerID})

        truffleAssert.eventEmitted(tx_add, 'ConsumerRemoved', (ev) => {
            return ev.account == consumerID;
        });

        let tx_check = await supplyChain.isConsumer(consumerID)

        assert.equal(tx_check, false)
    })
});
