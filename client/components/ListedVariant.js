import React, { Component } from 'react';

import Size from './Size'

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

export default class ListedVariant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            sizeElements: []
        }
    }

    componentDidMount = () => {
        let elements = this.props.variants.map((variant) => {

            return <Size
                title={variant.option1}
                variantId={variant.id}
                inventoryId={variant.inventory_item_id}
                checked={false} />
        })
        this.setState({ sizeElements: elements })
    }

    handleChange = () => {
        if (this.state.checked === false) {
            this.setState({ checked: true })
        } else if (this.state.checked === true) {
            this.setState({ checked: false })
        }
    }


    render() {
        return (
            <li >
                <Card title={this.props.title} sectioned>
                    Variantes
                    <div />

                    {this.state.sizeElements}

                </Card>
            </li>
        )
    }
}
