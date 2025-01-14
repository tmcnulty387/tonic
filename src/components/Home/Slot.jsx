import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListGroupItem, Badge, ButtonGroup, Button } from 'reactstrap';

import EditSlotModal from './EditSlotModal';
import ConfirmDropModal from './ConfirmDropModal';

import { dropDrink } from '../../actions';

class Slot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDropModal: false,
            editModal: false,
        };

        this.drop = this.drop.bind(this);
        this.toggleEditModal = this.toggleEditModal.bind(this);
        this.toggleConfirmDropModal = this.toggleConfirmDropModal.bind(this);
    }

    toggleConfirmDropModal() {
        this.setState((prevState) => ({
            confirmDropModal: !prevState.confirmDropModal,
        }));
    }

    toggleEditModal() {
        this.setState((prevState) => ({
            editModal: !prevState.editModal,
        }));
    }

    drop() {
        this.props.dropDrink(
            this.props.oidc.user.access_token,
            this.props.machine.name,
            this.props.slotNum
        );
    }

    render() {
        const disabled =
            this.props.slot.empty || // empty via sensors
            !this.props.slot.active || // manually set inactive
            (this.props.slot.count !== null && this.props.slot.count < 1); // empty via DB count
        return (
            <ListGroupItem className="drink-item" disabled={disabled}>
                <span className="text">{this.props.slot.item.name}</span>

                <span className="pull-right">
                    <Badge className="price-badge" color="success">
                        {this.props.slot.item.price} credits
                    </Badge>
                    <ButtonGroup size="sm" className="pull-right">
                        <Button
                            className="drop"
                            onClick={this.toggleConfirmDropModal}
                            disabled={
                                disabled || this.props.drink_balance < this.props.slot.item.price
                            }
                            color="primary"
                        >
                            Drop
                        </Button>
                        {this.props.isDrinkAdmin && (
                            <Button color="info" onClick={this.toggleEditModal}>
                                Edit
                            </Button>
                        )}
                    </ButtonGroup>
                    {this.state.confirmDropModal && (
                        <ConfirmDropModal
                            machine={this.props.machine}
                            toggle={this.toggleConfirmDropModal}
                            modal={this.state.confirmDropModal}
                            confirm={this.drop}
                        />
                    )}
                    {this.state.editModal && (
                        <EditSlotModal
                            machine={this.props.machine}
                            slot={this.props.slotNum}
                            toggle={this.toggleEditModal}
                            modal={this.state.editModal}
                            drink={this.props.slot}
                        />
                    )}
                </span>
            </ListGroupItem>
        );
    }
}

const mapStateToProps = (state) => ({
    oidc: state.oidc,
    drink_balance: (state.apis.credits.user || {}).drinkBalance,
});

const mapDispatchToProps = (dispatch) => ({
    dropDrink: (access_token, machine, slot) => dropDrink(dispatch, access_token, machine, slot),
});

export default connect(mapStateToProps, mapDispatchToProps)(Slot);
