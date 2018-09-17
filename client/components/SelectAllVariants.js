import React, { Component } from 'react';
import store from "../store/index"
import { addAllVariants, removeAllVariants } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class SelectAllVariants extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    handleChange = () => {
        if (this.state.checked === false) {
            store.dispatch(addAllVariants(this.props.productId))
            this.setState({ checked: true })

        } else if (this.state.checked === true) {
            store.dispatch(removeAllVariants(this.props.productId))
            this.setState({ checked: false })
        }
    }

    render() {
        return (
            <Button onClick={this.handleChange} plain={true} >
                <Checkbox checked={this.state.checked} />
                Selectionner Tous
            </Button>
        )
    }
}
