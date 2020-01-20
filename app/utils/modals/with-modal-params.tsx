/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {ShowExportModalType} from '../../modules/export/export-popup';

type WrapperProps = {
    modalParams: ShowExportModalType
}

export function withModalParams(WrappedComponent: any) {
    function Wrapper({modalParams = {}, ...props}: WrapperProps) {
        return <WrappedComponent {...modalParams} {...props} />;
    }
    Wrapper.displayName = `withModalParams(${WrappedComponent.displayName || WrappedComponent.name})`;
    return Wrapper;
}
