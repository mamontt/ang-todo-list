/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export {
    LETTER_PAGE_NAME,
    LETTER_PAGE_STORE_KEY,
    LETTER_PAGE_FETCH_NAMESPACE
} from './letter-page-constants';
export {default as reducer} from './reducer';
export {LetterPageContainer as LetterPageEmployee} from './employee/letter-page-container';
export {LetterPageContainer as LetterPageOfficial} from './official/letter-page-container';
