/**
 * External dependencies.
 */
import {
	TextControl,
	TextareaControl,
	SelectControl,
} from '@wordpress/components';
import { MultiSelectControl } from '@codeamp/block-components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
	Section,
	SectionTitle,
	SectionDescription,
	InputWrapper,
	SquareCheckboxControl,
} from '../../../components';

import { useSettings } from '../../hooks';

export const CreditCardSetup = () => {
	const { setCreditCardData, getCreditCardData } = useSettings();
	const {
		title,
		description,
		charge_virtual_orders,
		enable_paid_capture,
		transaction_type,
		tokenization,
		card_types
	} = getCreditCardData();

	const authorizationFields = 'authorization' === transaction_type && (
		<>
			<InputWrapper
				description={ __( 'If the order contains exclusively virtual items, enable this to immediately charge, rather than authorize, the transaction.', 'woocommerce-square' ) }
			>
				<SquareCheckboxControl
					label={ __( 'Charge Virtual-Only Orders', 'woocommerce-square' ) }
					checked={ 'yes' === charge_virtual_orders }
					onChange={ ( charge_virtual_orders ) => setCreditCardData( { charge_virtual_orders: charge_virtual_orders ? 'yes' : 'no' } ) }
				/>
			</InputWrapper>

			<InputWrapper
				description={ __( 'Automatically capture orders when they are changed to Processing or Completed.', 'woocommerce-square' ) }
			>
				<SquareCheckboxControl
					label={ __( 'Capture Paid Orders', 'woocommerce-square' ) }
					checked={ 'yes' === enable_paid_capture }
					onChange={ ( enable_paid_capture ) => setCreditCardData( { enable_paid_capture: enable_paid_capture ? 'yes' : 'no' } ) }
				/>
			</InputWrapper>
		</>
	);

	return (
		<>
			<Section>
				<SectionTitle title={ __( 'Manage Credit Card Payment Settings', 'woocommerce-square' ) } />
				<SectionDescription>
					{ __( 'Here you can fine-tune the details of how credit card payments are processed, ensuring a secure and smooth transaction for every customer.', 'woocommerce-square' ) }
				</SectionDescription>

				<InputWrapper label={ __( 'Title', 'woocommerce-square' ) } >
					<TextControl
						value={ title }
						onChange={ ( title ) => setCreditCardData( { title } ) }
					/>
				</InputWrapper>

				<InputWrapper label={ __( 'Description', 'woocommerce-square' ) } >
					<TextareaControl
						value={ description }
						onChange={ ( description ) => setCreditCardData( { description } ) }
					/>
				</InputWrapper>

				<InputWrapper label={ __( 'Transaction Type', 'woocommerce-square' ) } >
					<SelectControl
						value={ transaction_type }
						onChange={ ( transaction_type ) => setCreditCardData( { transaction_type } ) }
						options={ [
							{
								label: __( 'Charge', 'woocommerce-square' ),
								value: 'charge'
							},
							{
								label: __( 'Authorization', 'woocommerce-square' ),
								value: 'authorization'
							}
						] }
					/>
				</InputWrapper>

				{ authorizationFields }

				<InputWrapper label={ __( 'Accepted Card Logos', 'woocommerce-square' ) } >
					<MultiSelectControl
						label=""
						__experimentalShowHowTo={ false }
						value={ card_types }
						onChange={ ( card_types ) => setCreditCardData( { card_types } ) }
						options={ [
							{
								label: __( 'Visa', 'woocommerce-square' ),
								value: 'VISA',
							},
							{
								label: __( 'MasterCard', 'woocommerce-square' ),
								value: 'MC',
							},
							{
								label: __( 'American Express', 'woocommerce-square' ),
								value: 'AMEX',
							},
							{
								label: __( 'Discover', 'woocommerce-square' ),
								value: 'DISC',
							},
							{
								label: __( 'Diners', 'woocommerce-square' ),
								value: 'DINERS',
							},
							{
								label: __( 'JCB', 'woocommerce-square' ),
								value: 'JCB',
							},
							{
								label: __( 'UnionPay', 'woocommerce-square' ),
								value: 'UNIONPAY',
							},
						] }
					/>
				</InputWrapper>

				<InputWrapper
					label={ __( 'Customer Profiles', 'woocommerce-square' ) }
					>
					<SquareCheckboxControl
						label={ __( 'Check to enable tokenization and allow customers to securely save their payment details for future checkout.', 'woocommerce-square' ) }
						checked={ 'yes' === tokenization }
						onChange={ ( tokenization ) => setCreditCardData( { tokenization: tokenization ? 'yes' : 'no' } ) }
					/>
				</InputWrapper>
			</Section>
		</>
	);
};