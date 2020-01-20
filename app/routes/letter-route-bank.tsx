/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {withUserContext} from './../modules/user-context';
import * as ROUTE from './../constants/routes';
import {documentRoute} from './../utils/routing';
import {
    OfficialLetterScrollerToBank,
    OfficialLetterScrollerFromBank
} from './../pages/letter-scroller';
import {LETTER_PAGE_NAME} from './../pages/letter-page';

export const LetterRouteBank = withRouter(
    ({match}) => {
        const makeBaseDocumentPath = (path: string) => `${match.url}/${path}`;
        return (
            <Fragment>
                {documentRoute(
                    makeBaseDocumentPath(ROUTE.EMPLOYEE_LETTER_TO_BANK),
                    LETTER_PAGE_NAME,

                    withRouter((withUserContext(OfficialLetterScrollerToBank)) as any)
                )}
                {documentRoute(
                    makeBaseDocumentPath(ROUTE.EMPLOYEE_LETTER_FROM_BANK),
                    LETTER_PAGE_NAME,

                    withRouter((withUserContext(OfficialLetterScrollerFromBank)) as any)
                )}
            </Fragment>
        );
    }
);
