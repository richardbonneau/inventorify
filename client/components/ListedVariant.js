import React, { Component } from 'react';

import { connect } from "react-redux"

import SingleVariantBlock from './SingleVariantBlock'
import SelectAllVariants from './SelectAllVariants'

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';
import SelectColorVariants from './SelectColorVariants';

class ListedVariant extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            lifyedVariantBlocks: [],
            lifyedColorVariants: []
        }
    }

    componentDidMount = () => {
        let variantBlocks = this.props.variants.map((variant) => {
            return <SingleVariantBlock
                size={variant.option1}
                color={variant.option2}
                productId={this.props.productId}
                variantId={variant.id}
                inventoryId={variant.inventory_item_id}
                checked={false}
            />
        })

        let variantsObj = {}
        this.props.variants.forEach(i => {
            if (variantsObj[i.option2] === undefined) {
                variantsObj[i.option2] = { variantId: [i.id], invId: [i.inventory_item_id] }
            } else {
                variantsObj[i.option2].variantId.push(i.id);
                variantsObj[i.option2].invId.push(i.inventory_item_id);
            }
        })
        let lifyedColorVariants = [];
        for (var key in variantsObj) {
            if (variantsObj.hasOwnProperty(key)) {
                lifyedColorVariants.push(
                    <div style={{ display: "flex" }} >
                        <div style={{ width: "10px" }} />
                        <SelectColorVariants
                            title={key}
                            arrVariantId={variantsObj[key].variantId}
                            arrInvId={variantsObj[key].invId}
                        /> </div>
                )
            }
        }

        this.setState({
            lifyedVariantBlocks: variantBlocks,
            lifyedColorVariants: lifyedColorVariants
        })
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
                    <div style={{ display: "flex" }}>
                        <SelectAllVariants
                            productId={this.props.productId}
                        />

                        {this.state.lifyedColorVariants}
                    </div>
                    <div style={{ height: "20px" }} />
                    Variantes
                    <div />

                    {this.state.lifyedVariantBlocks}
                </Card>
            </li >
        )
    }
}

const mapStateToProps = state => {
    return {
        selectAllVariants: state.selectAllVariants
    }
}

export default connect(mapStateToProps)(ListedVariant)