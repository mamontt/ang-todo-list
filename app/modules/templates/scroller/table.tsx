/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, SyntheticEvent} from 'react';
import {connect} from 'react-redux';
import {memoize, isFunction, get} from 'lodash';
import {noop} from '@vtb/services/utils';
import styleNames from '@vtb/services/style-names';
import {Scroller, DataTable, DataTableColumnType} from '@vtb/fe-ui-table';
import {Loader} from '@vtb/fe-ui-loader';
import {Icons} from '@vtb/fe-ui-icon';
import {DEFAULT_PAGE_SIZE} from './../../../constants/size';
import {translate} from './../../../utils/translate';
import {FullEllipsisText} from './../../../components/full-ellipsis-text';
import {TEMPLATES_DESCRIPTORS} from '../template-descriptors';
import {createApiTemplate, openCreateTemplate, removeTemplateNotification} from '../actions';
import {
    TEMPLATE_NOTIFICATION_DELETED,
    TEMPLATE_NOTIFICATION_FAILURE,
    TEMPLATE_NOTIFICATION_SUCCESS
} from '../notifications';
import {updateValidate} from '../create-template/validate';
import {TRUE} from '../constants';
import styles from './table.scss';
import {DeleteTemplateActionType, GetData, TemplateType} from '../flow-types';
import {StoreType} from '../../../store/root-selector';

type Sorting = {
    column: string;
    direction: string;
}

type MapStateToProps = {
    activeRow?: TemplateType;
    isLoading: boolean;
    data: Array<TemplateType>;
    sorting: Array<Sorting>;
}

type TemplatesTableType = {
    setActiveRow?: (row: RowType) => void;
    getData?: GetData;
    scrollerName: string; // eslint-disable-line react/no-unused-prop-types
    docTypeId: number;
    deleteTemplate?: DeleteTemplateActionType;
    setSorting?: () => void;
    openCreateTemplate?: (template: any) => void;
    removeNotification?: (row: TemplateType, getData: GetData) =>
        (value: TemplateType | Object[]) => TemplateType | Object[] | PromiseLike<TemplateType | Object[]>;
};

type TablePropsType = TemplatesTableType & MapStateToProps

const sn = styleNames(styles);

type ActionButtonType = {
    hovered: boolean;
    icon: string;
    onClick: (event: SyntheticEvent<HTMLSpanElement>) => void;
}

const ActionButton = ({hovered, icon: Icon, onClick}: ActionButtonType) => hovered && (
    <span
        className={sn('cell-action-button')}
        onClick={onClick}
        onKeyDown={noop}
    >
        <Icon />
    </span>
);

type RowType = {
    row: TemplateType,
    rowState: {
        hovered: boolean
    }
}

class TemplatesTable extends Component<TablePropsType> {
    handleRowActivate = (activeRow: RowType) => this.props.setActiveRow(activeRow);

    modifyLastColumn = memoize(columns => (columns.length
        ? columns.slice(0, columns.length - 1)
            .concat([this.modifyColumn(columns[columns.length - 1])])
        : []));

    modifyColumn = (column: typeof DataTableColumnType) => ({
        ...column,
        cell: ({ row, rowState }: RowType) => {
            const apiTemplate = createApiTemplate(row.docTypeId);
            return (
                <span className={sn('cell')}>
                    <span className={sn('cell-value')}>
                        <FullEllipsisText>
                            {isFunction(column.selector) && column.selector(row)}
                        </FullEllipsisText>
                    </span>
                    <span className={sn('action-menu')}>
                        <ActionButton
                            onClick={() => {
                                this.props.openCreateTemplate({
                                    form: {...row},
                                    templates: this.props.data,
                                    withChose: false,
                                    title: 'template.title-edit',
                                    validate: updateValidate,
                                    initialValues: {
                                        update: TRUE,
                                        name: row.name
                                    },
                                    findTemplateAction:
                                        (extraData = {}, extraParams = {}) =>
                                            apiTemplate.findTemplates(
                                                {
                                                    ...extraData,
                                                    clientId: row.clientId,
                                                    docTypeId: row.docTypeId
                                                },
                                                {
                                                    ...extraParams,
                                                    page: 0,
                                                    size: DEFAULT_PAGE_SIZE
                                                }
                                            ),
                                    updateTemplateAction:
                                        (template: Object, name: string) =>
                                            apiTemplate.updateTemplate(
                                                {
                                                    id: get(template, 'id'),
                                                    clientId: row.clientId,
                                                    name,
                                                    docTypeId: row.docTypeId,
                                                    attributeComposition: row.attributeComposition
                                                },
                                                {},
                                                get(template, 'id')
                                            )
                                                .catch(noop)
                                                .finally(() => {
                                                    this.props.getData();
                                                    this.props.setActiveRow(null);
                                                }),
                                    updateFieldsTip: (name: string) =>
                                        translate('template.update-existing', {name}),
                                    notifications: {
                                        success: TEMPLATE_NOTIFICATION_SUCCESS,
                                        failure: TEMPLATE_NOTIFICATION_FAILURE,
                                        deleted: TEMPLATE_NOTIFICATION_DELETED,
                                        impossible: TEMPLATE_NOTIFICATION_FAILURE
                                    }
                                });
                            }}
                            icon={Icons.Edit}
                            hovered={rowState.hovered}
                        />
                        <ActionButton
                            onClick={() => this.handleDeleteTemplate(row)}
                            icon={Icons.Delete}
                            hovered={rowState.hovered}
                        />
                    </span>
                </span>
            );
        }
    });

    handleDeleteTemplate = (
        row: TemplateType
    ) => {
        const {
            deleteTemplate,
            getData,
            setActiveRow,
            removeNotification
        } = this.props;

        deleteTemplate(row)
            .then(removeNotification(row, getData))
            .catch(noop)
            .finally(() => {
                getData();
                setActiveRow(null);
            });
    };

    render() {
        const {
            activeRow, data, isLoading, docTypeId, setSorting, sorting
        } = this.props;
        const columns = this.modifyLastColumn(TEMPLATES_DESCRIPTORS[docTypeId].columns());

        return (
            isLoading
                ? <Loader.InContainer />
                : (<DataTable
                    activeRow={activeRow}
                    columns={columns}
                    joinColumns
                    multiSelect={false}
                    onRowActivate={this.handleRowActivate}
                    onRowClick={noop}
                    onRowDblClick={noop}
                    rowIdGetter={(row: TemplateType) => row.id}
                    rows={data || []}
                    onSortingChange={setSorting}
                    sorting={sorting}
                />)
        );
    }
}

const mapStateToProps = (state: StoreType, {scrollerName}: TemplatesTableType): MapStateToProps => ({
    isLoading: Scroller.selectors.getLoadingState(state, scrollerName),
    activeRow: Scroller.selectors.getActiveRow(state, scrollerName),
    data: Scroller.selectors.getData(state, scrollerName),
    sorting: Scroller.selectors.getSorting(state, scrollerName)
});

export const Table = connect(mapStateToProps,
    {
        openCreateTemplate,
        removeNotification: removeTemplateNotification
    })(TemplatesTable);
