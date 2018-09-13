import React, { Component } from 'react';

import { connect } from "react-redux"

import SingleVariantBlock from './SingleVariantBlock'
import SelectAllVariants from './SelectAllVariants'

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';

class ListedVariant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            sizeElements: []
        }
    }

    componentDidMount = () => {
        let elements = this.props.variants.map((variant) => {

            return <SingleVariantBlock
                size={variant.option1}
                color={variant.option2}
                productId={this.props.productId}
                variantId={variant.id}
                inventoryId={variant.inventory_item_id}
                checked={false}
            />
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
                    <SelectAllVariants
                        productId={this.props.productId}
                    />
                    <div style={{ height: "20px" }} />
                    Variantes
                    <div />

                    {this.state.sizeElements}

                </Card>
            </li>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectAllVariants: state.selectAllVariants
    }
}

export default connect(mapStateToProps)(ListedVariant)