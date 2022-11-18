pragma solidity ^0.8.7;

contract TicketSale {

    // <contract_variables>
    uint ticketPrice;
    uint numTickets = 10 gwei;
    address payable owner;
    uint swapTo;
    uint offer;
    address offerE;

    struct ticket {
        uint ticketId;
        bool ownedTicket;
        address ticketOwner;
    }

    struct validAddress {
        uint holdingTicketID;
        bool ownedTicket;
    }

    mapping(uint => ticket) public masterLedger;
    mapping(address => validAddress) public havePurchased;

    constructor(uint totalTickets, uint price) public {
        owner = payable(msg.sender);
        ticketPrice = price;
        numTickets = totalTickets;

        uint i = 0;
        for (i = totalTickets; i > 0; i--) {
            masterLedger[i].ticketId = i;
        }
    }

    //Succeeds only if ticketId is a valid ticket identifier, the ticket has not yet been sold,
    //the sender has not bought a ticket yet, and he/she sends the correct amount of ether.
    function buyTicket(uint requestedID) public payable returns(string memory) {
            if (
            //The sent message value is enough to purchase the ticket
                msg.value >= ticketPrice &&

                //The requestedID is in a valid ID range
                requestedID <= numTickets &&
                requestedID >= 0 &&

                //The requestedID is not a purchased ticket
                masterLedger[requestedID].ownedTicket == false &&

                //The message sender has not purchased the ticket yet
                havePurchased[msg.sender].ownedTicket == false)
            {
                owner.send(msg.value);

                masterLedger[requestedID].ownedTicket = true;
                masterLedger[requestedID].ticketOwner = msg.sender;
                havePurchased[msg.sender].ownedTicket = true;
                havePurchased[msg.sender].holdingTicketID = requestedID;
                return "The requested ticket has been purchased";

            } else {
                return "There has been an error, please review your purchase";
            }
        }

    function getTicketOf(address person) public view returns (uint) {
        if (havePurchased[person].ownedTicket == false) {
            return 0;
        } else {
            return havePurchased[person].holdingTicketID;
        }
    }

    function offerSwap(address partner) public {
        //checks to see if the requested trader address has purchased tickets
        if (havePurchased[partner].ownedTicket == true) {
            //Checks is msg sender has purchased a ticket
            if (havePurchased[msg.sender].ownedTicket == true) {
                //swapTo becomes the ticketID of the requested address to trade with
                swapTo = havePurchased[partner].holdingTicketID; //1
                //offer is takes the ticketID of the address requesting a trade
                offer = havePurchased[msg.sender].holdingTicketID; //2
                //Holding variable for the msg.sender's address
                offerE = msg.sender;
            }
        }
    }

    function acceptSwap() public {
        //Checks is msg sender has purchased a ticket
        if (havePurchased[msg.sender].ownedTicket == true) {
            //checks if the accepting address has a open request
            if (swapTo == havePurchased[msg.sender].holdingTicketID) {

                masterLedger[offer].ticketOwner = msg.sender;
                havePurchased[msg.sender].holdingTicketID = offer;

                masterLedger[swapTo].ticketOwner = offerE;
                havePurchased[offerE].holdingTicketID = swapTo;

                swapTo = 0;
                offer = 0;
            }
        }
    }
    function getSwapTo() public returns (uint) {
        return swapTo;
    }
    function getOfferE() public returns (address) {
        return offerE;
    }
    function getOffer() public returns (uint) {
        return offer;
    }
}

