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

    componentDidUpdate = (prevProps) => {
        if (this.props.selectAllVariants !== prevProps.selectAllVariants) {
            let isIdPresent = false;
            this.props.selectAllVariants.forEach((i) => {
                if (i === this.props.productId && isIdPresent === false) {
                    isIdPresent = true;
                    this.setState({ checked: true });
                    store.dispatch(removeInventoryId(this.props.inventoryId));
                    store.dispatch(removePriceId(this.props.variantId));
                    store.dispatch(addInventoryId(this.props.inventoryId));
                    store.dispatch(addPriceId(this.props.variantId));
                }
            })
            if (isIdPresent === false) {
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
        selectAllVariants: state.selectAllVariants
    }
}

export default connect(mapStateToProps)(SingleVariantBlock)