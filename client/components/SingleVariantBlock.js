import React, { Component } from 'react';

import { connect } from "react-redux"
import store from "../store/index"
import { addInventoryId, removeInventoryId, addPriceId, removePriceId } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

class SingleVariantBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    componentDidMount = () => {
        //console.log("singleprops", this.props.variantId)
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.selectAllVariants !== prevProps.selectAllVariants) {
            let isProductIdPresent = false;

            this.props.selectAllVariants.forEach((i) => {
                if (i === this.props.productId && isProductIdPresent === false) {
                    isProductIdPresent = true;
                    store.dispatch(removeInventoryId(this.props.inventoryId));
                    store.dispatch(removePriceId(this.props.variantId));
                    store.dispatch(addInventoryId(this.props.inventoryId));
                    store.dispatch(addPriceId(this.props.variantId));
                    this.setState({ checked: true });
                }
            })
            if (isProductIdPresent === false) {
                this.setState({ checked: false });
                store.dispatch(removeInventoryId(this.props.inventoryId));
                store.dispatch(removePriceId(this.props.variantId));
            }
        }
        if (this.props.colorVariantIds !== prevProps.colorVariantIds) {
            let isVariantIdPresent = false;

            this.props.colorVariantIds.forEach((i) => {
                if (i === this.props.variantId && isVariantIdPresent === false) {
                    isVariantIdPresent = true;
                    store.dispatch(removeInventoryId(this.props.inventoryId));
                    store.dispatch(removePriceId(this.props.variantId));
                    store.dispatch(addInventoryId(this.props.inventoryId));
                    store.dispatch(addPriceId(this.props.variantId));
                    this.setState({ checked: true });
                }
            })
            if (isVariantIdPresent === false) {
                this.setState({ checked: false });
                store.dispatch(removeInventoryId(this.props.inventoryId));
                store.dispatch(removePriceId(this.props.variantId));
            }
        }
    }

    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true });
            store.dispatch(removeInventoryId(this.props.inventoryId));
            store.dispatch(removePriceId(this.props.variantId));
            store.dispatch(addInventoryId(this.props.inventoryId));
            store.dispatch(addPriceId(this.props.variantId));
        } else if (this.state.checked === true) {
            this.setState({ checked: false });
            store.dispatch(removeInventoryId(this.props.inventoryId));
            store.dispatch(removePriceId(this.props.variantId));
        }
    }

    render() {
        return (
            <Button onClick={this.handleChange}>
                {this.props.color}
                <div />
                {this.props.size}
                <div />
                <div style={{ display: "flex", justifyContent: "center" }} >
                    <div style={{ width: "0.8rem" }} />
                    <Checkbox checked={this.state.checked} />
                </div>
            </Button>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectAllVariants: state.selectAllVariants,
        colorVariantIds: state.colorVariantIds
    }
}

export default connect(mapStateToProps)(SingleVariantBlock)