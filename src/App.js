import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";
import { AirlineService } from "./AirlineService";

const converter = (web3) => {
    return (value) =>{
        return web3.utils.fromWei(value.toString(),'ether');
    } 
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state ={
            account: undefined,
            Balance: 0,
            flights: [],
            loyalpoint: 0,
            availablefights: 0
        }
    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        this.airline = await AirlineContract(this.web3.currentProvider);
        this.AirlineService = new AirlineService(this.airline);
        var account = (await this.web3.eth.getAccounts())[0];
        this.setState({
            account: account.toLowerCase()
        },() => {
            this.load();
        });
    }

    async getBalance(){
        let weiBalance=await this.web3.eth.getBalance(this.state.account);
        this.setState({
            Balance : this.toEther(weiBalance)
        });
    }

    async getLoyalPoint(){
        let loyalpoint= await this.web3.eth.getLoyalPoint(this.state.account);
        this.setState({
            points : loyalpoint
        });
    }

    async getFlights(){
        let flights = await this.AirlineService.getFlights();
        this.setState({
            flights        
        });
    }

       async load(){
        this.getBalance();
        this.getFlights();
    }

    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Welcome to the Airline!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Balance">
                        <p>{this.state.account}</p>
                        <span>Balance: {this.state.Balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Loyalty points - refundable ether">
                        <p>{this.state.account}</p>
                        <span>points: {this.state.points}</span>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">
                    {this.state.flights.map((flight, i) => {
                            return <div key={i}>
                                <span>{flight.name} - cost: {this.toEther(flight.price)}</span>
                            </div>
                    })}
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">
                        <p>{this.state.account}</p>
                        <span>Your Fights: {this.state.fights}</span>
                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}