/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {connect} from 'react-redux';
import {noop} from 'lodash';
import {ModalLayout, Grid} from '@vtb/fe-ui-grid';
import styleNames from '@vtb/services/style-names';
import {Fields} from '@vtb/fe-ui-input';
import {Label} from '@vtb/fe-ui-label';
import {Button} from '@vtb/fe-ui-button';
import {translate} from './../../../../utils/translate';
import styles from './form-with-comment.scss';

const sn = styleNames(styles);

type FormWithCommentTypes = {
    handleSubmit?: Function,
    onSubmit?: Function,
    submitButtonLabel: string,
    cancelButtonLabel: string,
    submitFieldLabel: string,
    title: string,
    onClose: Function,
    withCross: boolean,
    submitting?: boolean,
    valid?: boolean,
    commentFieldKey: string
};

export class FormWithCommentComponent extends React.Component<FormWithCommentTypes> {
    static defaultProps = {
        onSubmit: noop,
        onClose: noop,
        commentFieldKey: 'reason'
    };

    getFooter = () => (
        <div className={sn('form-with-comment__footer')}>
            <Button.Light onClick={this.props.onClose}>
                {this.props.cancelButtonLabel}
            </Button.Light>
            <Button.Submit disabled={this.props.submitting || !this.props.valid}>
                {this.props.submitButtonLabel}
            </Button.Submit>
        </div>
    );

    getContent = () => (
        <Grid.Grid layout={Grid.LAYOUT.SIX} sticky>
            <Grid.Row vAlign={Grid.VERTICAL_ALIGN.TOP}>
                <Grid.Col col={2}>
                    <Label text={this.props.submitFieldLabel} forId={this.props.commentFieldKey} />
                </Grid.Col>
                <Grid.Col col={4}>
                    <Fields.TextArea
                        name={this.props.commentFieldKey}
                        width="100%"
                        height="112px"
                        maxLength={300}
                        placeholder={translate('document.validation.inputText')}
                    />
                </Grid.Col>
            </Grid.Row>
        </Grid.Grid>
    );

    render() {
        const {
            handleSubmit, onSubmit, onClose, title, withCross
        } = this.props;
        return (
            <form className={sn('form-with-comment')} onSubmit={handleSubmit(onSubmit)}>
                <ModalLayout.ModalLayout
                    size="large"
                    title={title}
                    onClose={withCross && onClose}
                    content={this.getContent()}
                    footer={this.getFooter()}
                    scrollable={false}
                    withInputs
                />
            </form>
        );
    }
}

export const FormWithComment = connect()(FormWithCommentComponent);
