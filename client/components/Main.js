import React, { Component } from 'react';

import ListedProduct from './ListedProduct'

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetched: [],
            lifyedList: [],
            selectedProductsByUser: [],
            checkboxesArr: []
        }
    }

    componentDidMount() {
        //  Logique pour le OnClick Event
        document.querySelector('body').addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() === 'button') {
                var isAlreadyInArray = false;
                this.state.selectedProductsByUser.forEach((id) => {
                    if (event.target.id === id) isAlreadyInArray = true;
                })
                if (isAlreadyInArray === false) {
                    this.setState({
                        selectedProductsByUser: this.state.selectedProductsByUser.concat(event.target.id)
                    })
                } else {
                    var indexOfItemWeWillRemove = this.state.selectedProductsByUser.indexOf(event.target.id)
                    this.setState({
                        selectedProductsByUser:
                            this.state.selectedProductsByUser.filter(el => {
                                if (this.state.selectedProductsByUser.indexOf(el) !== indexOfItemWeWillRemove) {
                                    return true;
                                }
                                else {
                                    //  Putting this var to -1 ensures that we won't filter any more elements
                                    indexOfItemWeWillRemove = -1;
                                    return false;
                                }
                            })
                    })
                }
                console.log("products in list: ", this.state.selectedProductsByUser)
            }
        })
    }

    //  En attendant d'avoir accès à l'api inventory
    testFetch = (value) => {
        console.log("fetching")
        let fetchedJson = {};
        return fetch('/shopify/api/products.json')
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                fetchedJson = responseJson;
                this.putDataInState(fetchedJson);
            })
    }
    putDataInState = (object) => {
        let list = [];
        object.products.forEach(product => {
            list.push(product);
        })
        this.setState({ fetched: list })
    }

    //  Button Methods
    checkObj = (value) => {
        console.log("before setstate", this.state.checkboxesArr)
    }

    renderList = () => {
        let newArr = [];
        let lify = this.state.fetched.map((product, ind) => {
            return <ListedProduct title={product.title} id={product.id} checked={false} />
        })

        this.setState({ lifyedList: lify })
    }

    render() {
        console.log("render", this.state)
        return (
            <div>
                <div>Main.js</div>
                <Button onClick={this.testFetch}>Fetch Json Data</Button>
                <div />
                <Button onClick={this.renderList}>Create List</Button>
                <div />
                <Button onClick={this.checkObj}>Check State</Button>

                <ul>
                    {this.state.lifyedList}
                </ul>
                <Button onClick={this.showSelectedProducts}>Show Selected Products</Button>
            </div>
        )
    }
}
