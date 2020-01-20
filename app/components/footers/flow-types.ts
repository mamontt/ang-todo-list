/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
type FooterButtonPropsType = {
    onClick: Function,
    title: string,
    disabled?: boolean
}

type FooterPaginationPropsType = {
    page: number,
    totalRecords: number,
    itemsPerPage: number,
    onChangePage: (nextPage: number) => Function | void,
    onChangeItemsPerPage: Function
}

export type FooterViewType = {
    submitButton: FooterButtonPropsType,
    cancelButton?: FooterButtonPropsType,
    pagination?: FooterPaginationPropsType
}
