/**
 * External dependencies.
 */
import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './index.scss';
import { Back, Square, Close } from '../../icons';

export const OnboardingHeader = ( { backStep, title, setStep } ) => {
    return (
        <div className="woo-square-onboarding__header">
            <Flex direction={[
                'column',
                'row'
            ]}>
                <FlexItem className='flexItem backBtn'>
                    { backStep && (
                        <Button onClick={ () => setStep( backStep ) }>
                            <Back />
                            <span>{ __( 'Back', 'woocommerce-square' ) }</span>
                        </Button>
                    ) }
                </FlexItem>
                <FlexBlock className='wizardTitle'>
                    <Square />
                    { __( 'Setup Wizard', 'woocommerce-square' ) + ' - ' }
                    <span>{ title }</span>
                </FlexBlock>
                <FlexItem className='flexItem closeWizard'>
                    <Button href='/wp-admin/'>
                        <Close />
                    </Button>
                </FlexItem>
            </Flex>
        </div>
    );
};
