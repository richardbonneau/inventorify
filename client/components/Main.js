import React, { Component } from 'react';

import ListedProduct from './ListedProduct'
import ProductModif from './ProductModif'

import { Layout, TextField, FormLayout, Select, Button } from '@shopify/polaris';
import { userInfo } from 'os';

export default class Main extends Component {
    storeLocation = 14069366849;

    constructor(props) {
        super(props);
        this.state = {
            searchInput: "",
            categorySelect: "poches",
            isSearchLoading: false,

            fetched: [],
            listOfSearchedProduct: [],
            lifyedSearch: [],

            selectedProductsByUser: [],
            selectedProductsObjects: [],
            lifyedModif: [],
            quantityInput: "",
            priceInput: "",
        }
    }

    componentDidMount() {
        //  Logique pour le OnClick Event
        document.querySelector('body').addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() === 'button' && event.target.id !== "") {
                console.log("eventtarget", event.target);
                let isAlreadyInArray = false;
                this.state.selectedProductsByUser.forEach((id) => {
                    if (event.target.id === id) isAlreadyInArray = true;
                })
                if (isAlreadyInArray === false) {
                    this.setState({
                        selectedProductsByUser: this.state.selectedProductsByUser.concat(event.target.id)
                    })
                } else {
                    let indexOfItemWeWillRemove = this.state.selectedProductsByUser.indexOf(event.target.id)
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
                //console.log("products in list: ", this.state.selectedProductsByUser)
            }
        })
    }


    //  Search
    searchFetch = () => {
        //  On reset l'array "selectedProduct by User" et "lifyed list" pour avoir un clean slate lorsque le user fait une nouvelle recherche
        this.setState({ selectedProductsByUser: [], lifyedSearch: [], isSearchLoading: true })
        return fetch('/shopify/api/products.json')
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ isSearchLoading: false })
                this.putDataInState(responseJson);
            })
            .then(() => { this.searchForKeywords(this.state.searchInput, this.state.fetched) })
            .then(() => { this.renderSearchList() })
    }
    putDataInState = (object) => {
        let list = [];
        object.products.forEach(product => {
            list.push(product);
        })
        this.setState({ fetched: list })
    }
    searchForKeywords(searchInput, fetched) {
        let filteredArr = fetched.filter((product) => {
            let lowerCaseTitle = product.title.toLowerCase();
            return lowerCaseTitle.includes(searchInput.toLowerCase());
        })
        this.setState({ listOfSearchedProduct: filteredArr })
    }
    renderSearchList = () => {
        let lify = this.state.listOfSearchedProduct.map((product) => {
            return <ListedProduct title={product.title} id={product.id} checked={false} />
        })
        this.setState({ lifyedSearch: lify })
    }


    //  Modif
    renderModifList = () => {
        let listObjects = [];
        this.state.selectedProductsByUser.forEach((selected) => {
            this.state.listOfSearchedProduct.forEach((searched) => {
                if (Number(selected) === searched.id) { listObjects.push(searched); }
            })
        })
        let lify = listObjects.map((product) => {
            return <ProductModif title={product.title} variants={product.variants} checked={false} />
        })
        this.setState({ lifyedModif: lify })
    }


    //  Handlers
    handleSelectChange = (value) => { this.setState({ categorySelect: value }) }
    handleSearchChange = (value) => { this.setState({ searchInput: value }) }
    handleQuantityChange = (value) => { this.setState({ quantityInput: value }) }
    handlePriceChange = (value) => { this.setState({ priceInput: value }) }


    //  Test Stuff
    testFetch = (value) => {
        return fetch('/shopify/api/inventory_levels.json?inventory_item_ids=12737606451265,12623115354177')
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
    }
    testPostFetch = (value) => {
        let stringBody = {
            "inventory_item_id": 12737606451265,
            "location_id": this.storeLocation,
            "available": 200
        }
        return fetch('/shopify/api/inventory_levels/set.json', {
            method: "POST",
            body: JSON.stringify(stringBody)
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            })
    }
    checkObj = (value) => {
        console.log("state", this.state)
    }


    render() {
        const options = [
            { label: "Poches", value: "poches" },
            { label: "Bas", value: "bas" },
            { label: "Boxer", value: "boxer" },
            { label: "Case Téléphone", value: "case" },
        ]
        return (
            <div>
                <div style={{ border: '2px solid black', padding: '5px', display: 'flex', justifyContent: 'space-around' }} >
                    Debug
                    <Button size="slim" onClick={this.checkObj}>Check State</Button>
                    <Button size="slim" onClick={this.testFetch}>Test Fetch</Button>
                    <Button size="slim" onClick={this.testPostFetch}>Test Post Fetch</Button>
                </div>
                <div style={{ height: '15px' }} />

                <FormLayout.Group>
                    <TextField
                        label="Rechercher"
                        onChange={this.handleSearchChange}
                        value={this.state.searchInput}
                        placeholder="exemple: Leg Day"
                    />
                    <Select
                        label="Catégorie"
                        options={options}
                        onChange={this.handleSelectChange}
                        value={this.state.categorySelect}
                    />
                </FormLayout.Group>
                <div style={{ height: '10px' }} />
                <Button fullWidth={true} loading={this.state.isSearchLoading} size="slim" onClick={this.searchFetch}>Rechercher</Button>

                <hr />
                <ul>
                    {this.state.lifyedSearch}
                </ul>
                <hr />

                <Button fullWidth={true} onClick={this.renderModifList} size="slim">Modifier les produits sélectionnés</Button>

                <hr />
                <ul>
                    {this.state.lifyedModif}
                </ul>
                <hr />

                <FormLayout.Group>
                    <TextField label="Quantité" onChange={this.handleQuantityChange} />
                    <TextField label="Prix" onChange={this.handlePriceChange} />
                </FormLayout.Group>

                <div style={{ height: '5px' }} />

                <Button primary fullWidth={true} >Appliquer les changements</Button>
            </div >
        )
    }
}
