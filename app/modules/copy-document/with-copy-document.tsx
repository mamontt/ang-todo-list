/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {changeModalParams, modalSelectors} from '@vtb/fe-ui-dialog';
import React from 'react';
import {withRouter} from 'react-router';
import querystring from 'querystring';
import {initialize} from 'redux-form';
import {connect} from 'react-redux';
import {compose} from 'redux';
import moment from 'moment';
import {get} from 'lodash';
import {GoTo} from '../../utils/routing';
import {setActiveTab} from '../../pages/letter-page/actions';
import {basicRequisitesTabId} from '../../constants/tabs-names';
import {setCapabilities} from '../capabilities';
import {clients} from '../../api/letter';
import {UserContext} from '../user-context';
import {LetterDirection} from '../define-letter-direction';
import {ResourceType} from '../resource';
import {Letter} from '../../common-types';

export interface WithCopyDocumentParams {
    resource: (letterDirection: LetterDirection) => ResourceType;
    form: string;
    letterDirection: LetterDirection;
}

type ParamsType = {
    documentId: number;
    goTo: GoTo;
    userContext: UserContext;
}

type PropsType = {
    location: Location;
    setCapabilities: (type: string, capabilities: Array<string>) => void;
    activeModal: {
        view: string;
        params: ParamsType;
    }
    changeModalParams: (view: string, params: ParamsType) => void;
    setActiveTab: (tabId: string) => void;
    initialize: (form: string, document: Letter) => void;
}

type StateType = {
    prevCopyFrom: string
}

export const withCopyDocument = ({resource, form, letterDirection}: WithCopyDocumentParams) => (
    WrappedComponent: any,
) =>
    compose(
        withRouter,
        connect(
            state => ({
                activeModal: modalSelectors.getActiveModal(state)
            }),
            {
                initialize,
                setCapabilities,
                changeModalParams,
                setActiveTab
            }
        )
    )(
        class WithCopyDocument extends React.PureComponent {
            static getDerivedStateFromProps(props: PropsType, state: StateType) {
                const {copyFrom} = querystring.parse(props.location.search.replace('?', ''));
                const copyFromChanged = copyFrom !== (state && state.prevCopyFrom);
                if (copyFrom && copyFromChanged) {
                    props.setCapabilities('letter', []);
                    if (props.activeModal) {
                        props.changeModalParams(props.activeModal.view, {
                            ...props.activeModal.params,
                            documentId: null
                        });
                    }
                    resource(letterDirection)
                        .get(`${copyFrom}/copy`)
                        .then((sourceDocument: any = {}) => {
                            const id = get(sourceDocument.clientSnapshot, 'id', -1);
                            clients(letterDirection, id).get()
                                .then(({value}) => {
                                    props.initialize(form, {
                                        ...sourceDocument,
                                        clients: [sourceDocument.clientSnapshot],
                                        documentDate: moment().startOf('day'),
                                        documentNumber: value,
                                        favourite: false,
                                        '@@copied': true
                                    });
                                    props.setActiveTab(basicRequisitesTabId);
                                });
                        });
                }

                return {
                    prevCopyFrom: copyFrom
                };
            }

            render() {
                return <WrappedComponent {...this.props} />;
            }
        }
    );
