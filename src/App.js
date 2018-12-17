import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import AirlineContract from "./airline";

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
            Balance: 0
        }
    }

    async componentDidMount() {
        this.web3 = await getWeb3();
        this.toEther = converter(this.web3);
        console.log(this.web3.version);
        this.airline = await AirlineContract(this.web3.currentProvider);
        console.log(this.airline.buyFlight);
        var account = (await this.web3.eth.getAccounts())[0];
        console.log(account);
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

    async load(){
        this.getBalance();
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

                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Available flights">


                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Your flights">

                    </Panel>
                </div>
            </div>
        </React.Fragment>
    }
}