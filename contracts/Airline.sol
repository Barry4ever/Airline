pragma solidity ^0.4.24;

contract Airline{
    address public owner;
    struct Customer{
        uint loyaltyPoints;
        uint totalFlights;
    }

    struct Flight{
        string name;
        uint price;
    }
    uint etherPerPoint = 0.5 ether;
    Flight[] public flights;

    mapping (address => Customer) public customers;
    mapping (address => Flight[]) public customerFlights;
    mapping (address => uint) public customerTotalFlights;
    event FlightPurchased(address indexed customer, uint price);
    constructor (){
        owner = msg.sender;
        flights.push(Flight('Tokio', 4 ether));
        flights.push(Flight('Berlin', 1 ether));
        flights.push(Flight('Bcn', 3 ether));        
    }

    function buyFlight (uint FlightIndex) public payable{
        Flight flight = flights[FlightIndex];
        require(msg.value == flight.price);
        Customer storage customer= customers[msg.sender];
        customer.loyaltyPoints +=5;
        customer.totalFlights +=1;
        customerFlights[msg.sender].push(flight);
        customerTotalFlights[msg.sender] ++;

        FlightPurchased(msg.sender, flight.price);
    }
    function totalFlights() public view returns (uint){
        return flights.length; //numero de vuelos disponibles
    }

    function redeemLoyaltyPoints () public {
        Customer storage customer = customers[msg.sender];//storage para que queden guardados los datos o memory para que sean volátiles
        uint etherToRefund = etherPerPoint * customer.loyaltyPoints;
        msg.sender.transfer(etherToRefund);
        customer.loyaltyPoints = 0;
    }

    function getAirlineBalance () public isOwner view returns (uint){ //isOwner para que sólo lo pueda ejecutar el Owner
        address airlinesAddress = this;
        return airlinesAddress.balance;

    }

    modifier isOwner (){ //para que sólo lo pueda ejecutar el owner del contrato
        require(msg.sender == owner);
        _;
    }
    function getRefundableEther() public view returns (uint){
        return etherPerPoint * customers[msg.sender].loyaltyPoints;
    }

}