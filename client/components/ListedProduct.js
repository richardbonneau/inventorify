import React, { Component } from 'react';

import { connect } from "react-redux"
import store from "../store/index"

import { Layout, Stack, Card, Checkbox, Button } from '@shopify/polaris';
import { addProductId, removeProductId } from '../actions';


class ListedProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            testObj: { test: "string" }
        }
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.props.selectAllProducts !== prevProps.selectAllProducts) {
            if (this.props.selectAllProducts === true) {
                store.dispatch(removeProductId(this.props.id));
                store.dispatch(addProductId(this.props.id));
                this.setState({ checked: true });
            } else {
                store.dispatch(removeProductId(this.props.id));
                this.setState({ checked: false });
            }
        }

    }

    handleChange = () => {
        if (this.state.checked === false) {
            store.dispatch(addProductId(this.props.id));
            this.setState({ checked: true });
        } else if (this.state.checked === true) {
            store.dispatch(removeProductId(this.props.id));
            this.setState({ checked: false });

        }
    }

    render() {
        return (
            <li class="productButton">
                <Button
                    id={this.props.id}
                    onClick={this.handleChange}
                >
                    <div style={{ display: "flex" }} >

                        {this.props.title}
                        <div style={{ width: "10px" }} />
                        <Checkbox
                            checked={this.state.checked}
                        />
                    </div>

                </Button>
            </li>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectAllProducts: state.selectAllProducts,
        productIds: state.productIds
    };
};

export default connect(mapStateToProps)(ListedProduct)
