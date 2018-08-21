import React, { Component } from 'react';

import ListedProduct from './ListedProduct'
import ListedVariant from './ListedVariant'

import { Layout, TextField, FormLayout, Select, Button, ChoiceList } from '@shopify/polaris';
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

            typeOfModification: "inventaire",
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
        //this.setState({ selectedProductsByUser: [], lifyedSearch: [], isSearchLoading: true })
        this.setState({ lifyedSearch: [], isSearchLoading: true })
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
            return <ListedProduct title={product.title} id={product.id} checked={false} selectedProductsByUser={this.state.selectedProductsByUser} />
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
            return <ListedVariant title={product.title} variants={product.variants} checked={false} />
        })
        this.setState({ lifyedModif: lify })
    }

    applyChanges = () => {
        for (let i = 0; i < 2; i++) {
            let variantId = 12952003969089;
            let inventoryId = 13106935496769;
            if (i === 1) variantId = 12952004001857;
            if (i === 1) inventoryId = 13081242042433;

            let inventoryBody = {
                "inventory_item_id": inventoryId,
                "location_id": this.storeLocation,
                "available": 66
            }
            let priceBody = {
                "variant": {
                    "id": variantId,
                    "price": "666.0"
                }
            }
            return fetch('/shopify/api/inventory_levels/set.json', {
                method: "POST",
                body: JSON.stringify(inventoryBody)
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    console.log("i", i)
                    return fetch('/shopify/api/variants/12952003969089.json', {
                        method: "PUT",
                        body: JSON.stringify(priceBody)
                    })
                        .then(response => response.json())
                        .then(responseJson => {
                            console.log(responseJson)
                            console.log("i", i)
                        })
                })
        }
    }



    //  Handlers
    handleSelectChange = (value) => { this.setState({ categorySelect: value }) }
    handleSearchChange = (value) => { this.setState({ searchInput: value }) }
    handleQuantityChange = (value) => { this.setState({ quantityInput: value }) }
    handlePriceChange = (value) => { this.setState({ priceInput: value }) }
    handleTypeOfModificationChange = (value) => { this.setState({ typeOfModification: value }) }



    //  Test Stuff 1417274753089
    testFetch = (value) => {
        let inventoryBody = {
            "inventory_item_id": 13106935496769,
            "location_id": this.storeLocation,
            "available": Number(this.state.quantityInput)
        }
        let priceBody = {
            "variant": {
                "id": 12952003969089,
                "price": this.state.priceInput
            }
        }
        return fetch('/shopify/api/inventory_levels/set.json', {
            method: "POST",
            body: JSON.stringify(inventoryBody)
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
                return fetch('/shopify/api/variants/12952003969089.json', {
                    method: "PUT",
                    body: JSON.stringify(priceBody)
                })
                    .then(response => response.json())
                    .then(responseJson => console.log(responseJson))
            })
    }
    testPostFetch = (value) => {
        let priceBody = {
            "variant": {
                "id": 12952003969089,
                "price": "99.00"
            }
        }
        return fetch('/shopify/api/variants/12952003969089.json', {
            method: "PUT",
            body: JSON.stringify(priceBody)
        })
            .then(response => response.json())
            .then(responseJson => console.log(responseJson))
    }
    checkObj = (value) => {
        console.log("state", this.state)
    }



    render() {
        console.log("parent list", this.state.selectedProductsByUser)
        const options = [
            { label: "Poches", value: "poches" },
            { label: "Bas", value: "bas" },
            { label: "Boxer", value: "boxer" },
            { label: "Case Téléphone", value: "case" },
        ]
        return (
            <div >
                <div style={{ border: '2px solid black', padding: '5px', display: 'flex', justifyContent: 'space-around' }} >
                    Debug
                    <Button size="slim" onClick={this.checkObj}>Check State</Button>
                    <Button size="slim" onClick={this.testFetch}>Test Fetch</Button>
                    <Button size="slim" onClick={this.testPostFetch}>Test Post Fetch</Button>
                </div>
                <div style={{ height: '15px' }} />

                <FormLayout.Group>
                    <div style={{ width: "170px" }}>
                        <TextField
                            label="Rechercher"
                            onChange={this.handleSearchChange}
                            value={this.state.searchInput}
                            placeholder="exemple: Leg Day"
                        />
                    </div>
                    <div style={{ width: "170px" }}>
                        <Select
                            label="Catégorie"
                            options={options}
                            onChange={this.handleSelectChange}
                            value={this.state.categorySelect}
                        />
                    </div>

                    <ChoiceList
                        choices={[
                            { label: "Changer l'inventaire", value: 'inventaire' },
                            { label: "Changer le prix", value: 'prix' },
                        ]}
                        selected={this.state.typeOfModification}
                        onChange={this.handleTypeOfModificationChange}
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
                    <TextField label="Quantité" type="number" onChange={this.handleQuantityChange} value={this.state.quantityInput} />
                    <TextField label="Prix" prefix="$" type="number" onChange={this.handlePriceChange} value={this.state.priceInput} />
                </FormLayout.Group>

                <div style={{ height: '15px' }} />

                <Button primary fullWidth={true} onClick={this.applyChanges} >Appliquer les changements</Button>
            </div>

        )
    }
}
