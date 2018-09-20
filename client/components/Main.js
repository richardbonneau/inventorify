import React, { Component } from 'react';

import { connect } from "react-redux"
import store from "../store/index";
import { createAllPossibleVariants } from "../actions/index"

import SelectAllProducts from './SelectAllProducts'
import ListedProduct from './ListedProduct'
import ListedVariant from './ListedVariant'
import SelectEveryVariants from './SelectEveryVariants'
import SelectEveryColor from './SelectEveryColor'

import { Layout, TextField, FormLayout, Select, Button, ChoiceList } from '@shopify/polaris';

class Main extends Component {
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
            lifyedSelectAllVariants: [],
            lifyedModif: [],
            selectedVariantsByUser: [],
            quantityInput: "",
            priceInput: "",

            isApplyInventoryLoading: false,
            isApplyPricesLoading: false,

            lifyedSelectEveryColor: []
        }
    }


    //  If the user presses enter it clicks the search button
    onKeyPressSearch = (event) => {
        if (event.which === 13) {
            this.searchFetch();
        }
    }

    //  Search
    //  REFACTORING: state is updated too many times
    searchFetch = () => {
        //  On reset l'array "lifyed list" pour avoir un clean slate lorsque le user fait une nouvelle recherche
        this.setState({ lifyedSearch: [], isSearchLoading: true })
        return fetch('/shopify/api/products.json')
            .then(response => response.json())
            .then(responseJson => {
                this.setState({ isSearchLoading: false })
                this.putDataInState(responseJson);
            })
            .then(() => { this.searchForKeywords(this.state.searchInput, this.state.fetched) })
            .then(() => { this.createObjectInGlobalState() })
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
    createObjectInGlobalState = () => {
        let obj = {};
        this.state.fetched.forEach((product) => {
            product.variants.forEach((variant) => { obj[variant.option2] = false; })
        })
        store.dispatch(createAllPossibleVariants(obj))

        let lify = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                lify.push(
                    <div>
                        <div style={{ width: "10px" }} />
                        <SelectEveryColor
                            propsKey={key}

                        /> </div>
                )
            }
        }
        this.setState({ lifyedSelectEveryColor: lify })
    }
    renderSearchList = () => {
        let lify = this.state.listOfSearchedProduct.map((product) => {
            return <ListedProduct title={product.title} id={product.id} checked={false} selectedProductsByUser={this.state.selectedProductsByUser} />
        })
        this.setState({ lifyedSearch: lify })
    }


    //  Modif
    renderModifList = () => {
        //  REFACTORING: cleaner, leaner
        let listObjects = [];
        this.props.productIds.forEach((selected) => {
            this.state.listOfSearchedProduct.forEach((searched) => {
                if (Number(selected) === searched.id) { listObjects.push(searched); }
            })
        })
        let lify = listObjects.map((product) => {
            return <ListedVariant title={product.title} productId={product.id} variants={product.variants} checked={false} />
        })
        this.setState({ lifyedModif: lify })
    }


    //  Apply Changes
    applyChangesToInventory = () => {
        //  The use of this loop is to apply change to every product that needs change
        //  Let's have an array of all the inventoryIds i want to modify, and assign each of the id to the inventoryId var as we go through the loop
        this.setState({ isApplyInventoryLoading: true })
        let inventoryIdsFromGlobalState = store.getState().inventoryIds;
        let array = new Array;
        var fetches = [];
        for (let i = 0; i < inventoryIdsFromGlobalState.length; i++) {
            let inventoryBody = {
                "inventory_item_id": inventoryIdsFromGlobalState[i],
                "location_id": this.storeLocation,
                "available": Number(this.state.quantityInput)
            };
            fetches.push(
                fetch('/shopify/api/inventory_levels/set.json', {
                    method: "POST",
                    body: JSON.stringify(inventoryBody)
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log(responseJson);
                        array.push(responseJson);
                    })
            );
        }
        Promise.all(fetches).then(() => {
            console.log("all", array.length, "fetches done")
            this.setState({ isApplyInventoryLoading: false })
            alert("all", array.length, "fetches done, page reloading");
            location.reload();
        });
    }

    applyChangesToPrice = () => {
        this.setState({ isApplyPricesLoading: true })
        let priceIdsFromGlobalState = store.getState().priceIds;
        let array = new Array;
        var fetches = [];
        for (let i = 0; i < priceIdsFromGlobalState.length; i++) {
            let priceBody = {
                "variant": {
                    "id": priceIdsFromGlobalState[i],
                    "price": this.state.priceInput
                }
            }
            fetches.push(
                fetch('/shopify/api/variants/' + priceIdsFromGlobalState[i] + '.json', {
                    method: "PUT",
                    body: JSON.stringify(priceBody)
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log(responseJson);
                        array.push(responseJson)
                    })
            );
        }
        Promise.all(fetches).then(() => {
            console.log("all", array.length, "fetches done")
            this.setState({ isApplyPricesLoading: false })
            alert("all" + array.length + "fetches done, page reloading");
            location.reload();
        });
    }


    //  Handlers
    handleSelectChange = (value) => { this.setState({ categorySelect: value }) }
    handleSearchChange = (value) => { this.setState({ searchInput: value }) }
    handleQuantityChange = (value) => { this.setState({ quantityInput: value }) }
    handlePriceChange = (value) => { this.setState({ priceInput: value }) }
    handleTypeOfModificationChange = (value) => { this.setState({ typeOfModification: value }) }


    //  Debug Functions
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
    checkReduxState = (value) => {
        console.log("reduxState", store.getState())
    }
    checkObj = (value) => {
        console.log("state", this.state)
    }



    render() {
        const options = [
            { label: "Poches", value: "poches" },
            // { label: "Bas", value: "bas" },
            // { label: "Boxer", value: "boxer" },
            // { label: "Case Téléphone", value: "case" },
        ]
        return (
            <div >
                {/* DEBUG STUFF */}
                <div style={{ border: '2px solid black', padding: '5px', display: 'flex', justifyContent: 'space-around' }} >
                    Debug
                    <Button size="slim" onClick={this.checkObj}>Check State</Button>
                    <Button size="slim" onClick={this.testFetch}>Test Fetch</Button>
                    <Button size="slim" onClick={this.checkReduxState}>Check Redux State</Button>
                </div>
                <div style={{ height: '15px' }} />

                <FormLayout.Group>
                    <div onKeyPress={this.onKeyPressSearch} style={{ width: "400px" }}>
                        <TextField
                            label="Rechercher"
                            onChange={this.handleSearchChange}
                            value={this.state.searchInput}
                            placeholder="Exemple: T-Shirt"
                        />
                    </div>
                    <div style={{ width: "400px" }}>
                        <Select
                            label="Catégorie"
                            options={options}
                            onChange={this.handleSelectChange}
                            value={this.state.categorySelect}
                        />
                    </div>


                </FormLayout.Group>
                <div style={{ height: '10px' }} />
                <Button fullWidth={true} loading={this.state.isSearchLoading} size="slim" onClick={this.searchFetch}>Rechercher</Button>

                <hr />
                <SelectAllProducts />

                <ul>
                    {this.state.lifyedSearch}
                </ul>
                <hr />

                <Button fullWidth={true} onClick={this.renderModifList} size="slim">Modifier les produits sélectionnés</Button>
                <hr />
                <div style={{ display: "flex" }} >
                    <SelectEveryVariants />
                    {this.state.lifyedSelectEveryColor}
                </div>
                <ul>
                    {this.state.lifyedModif}
                </ul>
                <hr />


                <FormLayout.Group>
                    <TextField label="Quantité" type="number" onChange={this.handleQuantityChange} value={this.state.quantityInput} />
                    <TextField label="Prix" prefix="$" type="number" onChange={this.handlePriceChange} value={this.state.priceInput} />
                </FormLayout.Group>

                <div style={{ height: '15px' }} />

                <FormLayout.Group>
                    <Button primary fullWidth={true} onClick={this.applyChangesToInventory} loading={this.state.isApplyInventoryLoading} >Changer Inventaire</Button>
                    <Button primary fullWidth={true} onClick={this.applyChangesToPrice} loading={this.state.isApplyPricesLoading} >Changer Prix</Button>
                </FormLayout.Group>
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        productIds: state.productIds
    };
};

export default connect(mapStateToProps)(Main)