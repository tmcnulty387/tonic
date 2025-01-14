import React from 'react';
import { connect } from 'react-redux';
import { CallbackComponent } from 'redux-oidc';
import { push } from 'connected-react-router';
import userManager from '../userManager';
import InfoSpinner from '../components/InfoSpinner/index';

const OidcCallback = ({ dispatch }) => (
    <CallbackComponent
        userManager={userManager}
        successCallback={() => dispatch(push('/'))}
        errorCallback={(error) => {
            // TODO: Redirect to a more friendly error page
            dispatch(push('/'));
            console.error(error);
        }}
    >
        <InfoSpinner>Signing you in, please wait...</InfoSpinner>
    </CallbackComponent>
);

export default connect()(OidcCallback);
