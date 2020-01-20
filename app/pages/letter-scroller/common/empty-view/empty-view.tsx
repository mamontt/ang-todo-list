/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import * as React from 'react';
import {Placeholder, PlaceholderHelpers} from '@vtb/fe-ui-placeholder';
import {translate} from './../../../../utils/translate';

const IMAGE_DIMENSIONS = 180;
const IMAGE_KEY = 'SEARCH';

export const EmptyView = () => {
    const {
        Layout,
        Wrapper,
        Media,
        Container,
        Content,
        Title,
        Text
    } = Placeholder;
    const {Image, ImageNames, BackgroundColors} = PlaceholderHelpers;

    return (
        <Layout backgroundColor={BackgroundColors.WHITE}>
            <Wrapper>
                <Container>
                    <Media>
                        <Image
                            name={ImageNames[IMAGE_KEY]}
                            height={IMAGE_DIMENSIONS}
                            width={IMAGE_DIMENSIONS}
                        />
                    </Media>
                    <Content>
                        <Title>
                            {translate('emptyView.title')}
                        </Title>
                        <Text>
                            {translate('emptyView.text')}
                        </Text>
                    </Content>
                </Container>
            </Wrapper>
        </Layout>
    );
};
