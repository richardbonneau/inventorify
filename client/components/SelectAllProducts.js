import React, { Component } from 'react';
import store from "../store/index"
import { selectAllProducts } from "../actions/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class SelectAllProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false
        }
    }

    componentDidMount = () => {
    }

    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true })
            store.dispatch(selectAllProducts(true))

        } else if (this.state.checked === true) {
            this.setState({ checked: false })
            store.dispatch(selectAllProducts(false))
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
