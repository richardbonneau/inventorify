import React, { Component } from 'react';
import store from "../store/index"
import { addInventoryId, removeInventoryId, addPriceId, removePriceId } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class SingleVariantBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        };
    }

    componentDidMount = () => {
        store.subscribe(() => {
            this.callback();
        })
    }

    callback = () => {
        store.getState().productIds.forEach((id) => {
            if (id === this.props.productId) {
                this.handleChange();
            }
        })
    }



    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true });
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
