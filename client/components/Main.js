import React, { Component } from 'react';

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
            if (event.target.tagName.toLowerCase() === 'li') {
                var isAlreadyInArray = false;
                this.state.selectedProductsByUser.forEach((id) => {
                    if (event.target.id === id) isAlreadyInArray = true;
                })
                if (isAlreadyInArray === false) {
                    this.setState({
                        selectedProductsByUser: this.state.selectedProductsByUser.concat(event.target.id)
                    })
                    this.enableCheckboxOnSelectedProducts()
                } else {
                    var indexOfItemWeWillRemove = this.state.selectedProductsByUser.indexOf(event.target.id)
                    this.setState({
                        selectedProductsByUser:
                            this.state.selectedProductsByUser.filter(el => {
                                if (this.state.selectedProductsByUser.indexOf(el) !== indexOfItemWeWillRemove) {
                                    return true;
                                }
                                else {
                                    indexOfItemWeWillRemove = -1;
                                    return false;
                                }
                            })
                    })
                    this.enableCheckboxOnSelectedProducts()
                }
            }
        })
    }

    enableCheckboxOnSelectedProducts = () => {
        let arr = this.state.checkboxesArr;
        this.state.fetched.forEach((i, ind) => {
            this.state.selectedProductsByUser.forEach((j) => {
                console.log("first check", i.id.toString() === j, "arr ind", arr[ind])
                if (i.id.toString() === j && arr[ind] === false) {
                    arr[ind] = true;
                } else if ((i.id.toString() === j && arr[ind] === true)) {
                    arr[ind] = false;
                }
            })
        })
        this.setState({ checkboxesArr: arr })
    }


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
            newArr.push(false)
            console.log(newArr)
            return (<li id={product.id}>{product.title} <Checkbox checked={this.state.checkboxesArr[ind]} /> </li>)
        })
        this.setState({ checkboxesArr: newArr, lifyedList: lify })
        console.log("apres renderList", this.state, "newArr", newArr)
    }
    showSelectedProducts = () => {
        alert(this.state.selectedProductsByUser)
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
