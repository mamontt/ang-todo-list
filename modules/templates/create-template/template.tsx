/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2018 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {reduxForm, change as changeReduxForm} from 'redux-form';
import {isEmpty, get} from 'lodash';
import {addNotification} from '@vtb/fe-ui-alert';
import {closeModal as closeModalAction} from '@vtb/fe-ui-dialog';
import {ModalLayout} from '@vtb/fe-ui-grid';
import {Loader} from '@vtb/fe-ui-loader';
import {translate} from './../../../utils/translate';
import {FORM_TEMPLATE_CREATE} from './../../../constants/forms';
import {FooterAlignRight} from './../../../components/footers';
import {getDictionaryClients} from '../../../modules/dictionary-new/selectors';
import {StoreType} from './../../../store/root-selector';
import {validate} from './validate';
import {FormModalTemplateType, TemplateType} from '../flow-types';
import {TemplateForm} from './content-view/template-form';
import {getIsUpdate, getUpdateValue} from './selectors';
import * as FIELDS from './fields';
import {TEMPLATES_FORM_INITIAL_VALUES, FALSE, TRUE} from '../constants';
import {saveTemplate as saveTemplateAction} from '../actions';
import {TEMPLATE_SAVE_IMPOSSIBLE} from '../notifications';

const getModalTemplateFooter = (submit: () => string, disabled: boolean) => {
    const submitButton = {
        onClick: submit,
        title: 'template.save',
        disabled
    };
    return <FooterAlignRight submitButton={submitButton} />;
};

type StateProp = {
    templates: Array<TemplateType>;
    processed: boolean;
    showWarning: boolean;
    activeName: string;
    fieldsTip: string;
}

class FormModalTemplateComponent extends Component<FormModalTemplateType, StateProp> {
    state = {
        templates: this.props.modalParams.templates || [],
        processed: false,
        showWarning: false,
        activeName: this.props.modalParams.form.name || '',
        fieldsTip: ''
    };

    componentDidMount() {
        this.template = get(this.props.modalParams, 'form', {});
    }

    componentDidUpdate() {
        const {
            modalParams: {
                withChose = true
            },
            change,
            updateValue
        } = this.props;

        const {
            templates
        } = this.state;

        if (templates[0] && withChose && !updateValue) {
            change(FIELDS.update, TRUE);
        }
    }

    onSubmit = (values: {update: string, name: string}) => {
        const {
            modalParams,
            syncErrors,
            closeWithNotify,
            saveTemplate
        } = this.props;
        const {withChose = true} = modalParams;
        const {templates} = this.state;
        const isExistsName = templates.some((template: TemplateType) => template.name === values.name);

        if (isExistsName || values.update === FALSE || !values.update) {
            this.setState({
                showWarning: true,
                activeName: values.name
            });
            this.setFieldsTip(values.name);
        }

        this.setState({processed: true});
        modalParams.findTemplates(values)
            .then(foundTemplates => {
                const equalNameTemplate = foundTemplates
                    .filter((template: TemplateType) => values.name === template.name);
                const templateId = get(equalNameTemplate, '[0].id');
                if (templateId) {
                    if (values.update !== TRUE) {
                        this.template = {
                            id: templateId
                        };
                    }
                    this.setState({templates: foundTemplates, processed: false});
                }
                const isEditTemplateSave = !withChose && !templateId && values.update === TRUE;
                const isCreateSaveTemplate = withChose &&
                    ((!templateId && values.update !== TRUE) || (templateId && values.update === TRUE));
                if ((isEditTemplateSave || isCreateSaveTemplate) && isEmpty(syncErrors)) {
                    saveTemplate(
                        modalParams.form,
                        modalParams.createTemplate,
                        modalParams.updateTemplate,
                        modalParams.deleteTemplate,
                        modalParams.notifications,
                        this.template,
                        this.setFieldsTip
                    );
                }
            })
            .catch(closeWithNotify);
    };

    onChangeTemplateName = () => this.props.change(FIELDS.name, this.state.activeName);

    setFieldsTip = (name: string, isConflictName: boolean = false) => {
        const fieldsTip = isConflictName ?
            translate('template.update-filter-comment') : translate('template.update-existing', {name});
        this.setState({fieldsTip});
    };

    template = {};

    render() {
        const {
            modalParams: {
                title,
                withChose = true
            },
            closeModal,
            update,
            handleSubmit,
            invalid
        } = this.props;
        const {
            templates,
            processed,
            showWarning,
            fieldsTip
        } = this.state;
        const isTemplate = Boolean(templates[0]);
        return (
            <Fragment>
                <ModalLayout.Small
                    title={translate(title || 'template.title')}
                    content={
                        <TemplateForm
                            template={isTemplate}
                            fieldsTip={fieldsTip}
                            changeTemplateName={this.onChangeTemplateName}
                            templateFieldNameDisabled={update}
                            withChose={withChose}
                            showWarning={showWarning}
                        />
                    }
                    footer={getModalTemplateFooter(handleSubmit(this.onSubmit), invalid)}
                    onClose={closeModal}
                />
                {processed && <Loader.InContainer />}
            </Fragment>
        );
    }
}

const closeWithNotify = (props: FormModalTemplateType) => (dispatch: Function) => {
    const {modalParams} = props;
    dispatch(closeModalAction());
    dispatch(addNotification(
        modalParams.notifications
            ? modalParams.notifications.impossible()
            : TEMPLATE_SAVE_IMPOSSIBLE()
    ));
};

export const FormModalTemplate = compose(
    connect(
        (state: StoreType, ownProps: FormModalTemplateType) => ({
            clients: getDictionaryClients(state),
            update: getIsUpdate(state),
            updateValue: getUpdateValue(state),
            initialValues: ownProps.modalParams.initialValues || TEMPLATES_FORM_INITIAL_VALUES,
            validate: ownProps.modalParams.validate || validate
        }),
        {
            closeModal: closeModalAction,
            saveTemplate: saveTemplateAction,
            change: changeReduxForm,
            closeWithNotify
        },
    ),
    reduxForm({
        form: FORM_TEMPLATE_CREATE
    })
)(FormModalTemplateComponent as any);
