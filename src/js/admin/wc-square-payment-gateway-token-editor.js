import '../../css/admin/wc-square-payment-gateway-token-editor.scss';

/*
 WooCommerce Square Payment Gateway Framework Token Editor
 */

( function () {
	jQuery( document ).ready( function ( $ ) {
		'use strict';
		let handleError, ref, wc_payment_gateway_token_editor;
		wc_payment_gateway_token_editor =
			( ref = window.wc_payment_gateway_token_editor ) != null ? ref : {};
		$( '.sv_wc_payment_gateway_token_editor' ).each( function () {
			let tokens;
			tokens = $( this ).find( 'tr.token' );
			if ( tokens.length === 0 ) {
				return $( this ).find( 'tr.no-tokens' ).show();
			}
			return $( this ).find( 'tr.no-tokens' ).hide();
		} );
		$( '.sv_wc_payment_gateway_token_editor' ).on(
			'click',
			'.button[data-action="remove"]',
			function ( e ) {
				let data, editor, row;
				e.preventDefault();
				if (
					! confirm(
						wc_payment_gateway_token_editor.actions.remove_token.ays
					)
				) {
					return;
				}
				editor = $( this ).closest( 'table' );
				editor.block( {
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.6,
					},
				} );
				editor.find( '.error' ).remove();
				row = $( this ).closest( 'tr' );
				if ( row.hasClass( 'new-token' ) ) {
					return row.remove();
				}
				data = {
					action:
						'wc_payment_gateway_' +
						editor.data( 'gateway-id' ) +
						'_admin_remove_payment_token',
					user_id: $( this ).data( 'user-id' ),
					token_id: $( this ).data( 'token-id' ),
					payment_token_id: $( this ).data( 'payment-token-id' ),
					security:
						wc_payment_gateway_token_editor.actions.remove_token
							.nonce,
				};
				return $.post( wc_payment_gateway_token_editor.ajax_url, data )
					.done(
						( function ( _this ) {
							return function ( response ) {
								if ( ! response.success ) {
									return handleError( editor, response.data );
								}
								$( row ).remove();
								if ( editor.find( 'tr.token' ).length === 0 ) {
									return editor.find( 'tr.no-tokens' ).show();
								}
							};
						} )( this )
					)
					.fail(
						( function ( _this ) {
							return function ( jqXHR, textStatus, error ) {
								return handleError(
									editor,
									textStatus + ': ' + error
								);
							};
						} )( this )
					)
					.always(
						( function ( _this ) {
							return function () {
								return editor.unblock();
							};
						} )( this )
					);
			}
		);
		$( 'table.sv_wc_payment_gateway_token_editor' ).on(
			'click',
			'.button[data-action="add-new"]',
			function ( e ) {
				let body, count, data, editor;
				e.preventDefault();
				editor = $( this ).closest( 'table' );
				editor.block( {
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.6,
					},
				} );
				body = editor.find( 'tbody.tokens' );
				count = body.find( 'tr.token' ).length;
				data = {
					action:
						'wc_payment_gateway_' +
						editor.data( 'gateway-id' ) +
						'_admin_get_blank_payment_token',
					index: count + 1,
					security:
						wc_payment_gateway_token_editor.actions.add_token.nonce,
				};
				return $.post(
					wc_payment_gateway_token_editor.ajax_url,
					data,
					function ( response ) {
						if ( response.success === true ) {
							body.append( response.data );
						}
						editor.find( 'tr.no-tokens' ).hide();
						return editor.unblock();
					}
				);
			}
		);
		$( 'table.sv_wc_payment_gateway_token_editor' ).on(
			'click',
			'.button[data-action="refresh"]',
			function ( e ) {
				let body, count, data, editor;
				e.preventDefault();
				editor = $( this ).closest( 'table' );
				editor.block( {
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.6,
					},
				} );
				editor.find( '.error' ).remove();
				body = editor.find( 'tbody.tokens' );
				count = body.find( 'tr.token' ).length;
				data = {
					action:
						'wc_payment_gateway_' +
						editor.data( 'gateway-id' ) +
						'_admin_refresh_payment_tokens',
					user_id: $( this ).data( 'user-id' ),
					security:
						wc_payment_gateway_token_editor.actions.refresh.nonce,
				};
				return $.post( wc_payment_gateway_token_editor.ajax_url, data )
					.done(
						( function ( _this ) {
							return function ( response ) {
								if ( ! response.success ) {
									return handleError( editor, response.data );
								}
								if ( response.data != null ) {
									editor.find( 'tr.no-tokens' ).hide();
									return body.html( response.data );
								}
								body.empty();
								return editor.find( 'tr.no-tokens' ).show();
							};
						} )( this )
					)
					.fail(
						( function ( _this ) {
							return function ( jqXHR, textStatus, error ) {
								return handleError(
									editor,
									textStatus + ': ' + error
								);
							};
						} )( this )
					)
					.always(
						( function ( _this ) {
							return function () {
								return editor.unblock();
							};
						} )( this )
					);
			}
		);
		$( 'table.sv_wc_payment_gateway_token_editor' ).on(
			'click',
			'.sv-wc-payment-gateway-token-editor-action-button[data-action="save"]',
			function ( e ) {
				let actions_row, editor, focused, inputs;
				editor = $( this ).closest( 'table' );
				actions_row = editor.find( 'tfoot th' );
				editor.block( {
					message: null,
					overlayCSS: {
						background: '#fff',
						opacity: 0.6,
					},
				} );
				actions_row.find( '.error, .success' ).remove();
				inputs = editor.find(
					'tbody.tokens tr.token input[type="text"]'
				);
				focused = false;
				return inputs.each( function ( index ) {
					let pattern, required, value;
					$( this ).removeClass( 'error' );
					value = $( this ).val();
					required = $( this ).prop( 'required' );
					pattern = $( this ).attr( 'pattern' );
					if ( ! ( required || value ) ) {
						return;
					}
					if ( ! value.match( pattern ) || ( required && ! value ) ) {
						e.preventDefault();
						$( this ).addClass( 'error' );
						if ( ! focused ) {
							actions_row.prepend(
								'<span class="error">' +
									wc_payment_gateway_token_editor.actions.save
										.error +
									'</span>'
							);
							$( this ).focus();
							focused = true;
						}
						return editor.unblock();
					}
				} );
			}
		);

		// Token fetch on customer change and method change to square
		$( 'select#customer_user, select#_payment_method' ).change( function () {
			var customer_id = $( 'select#customer_user' ).val();
			var payment_method = $( 'select#_payment_method' ).val();

			if( payment_method === 'square_credit_card' && ! isNaN( customer_id ) ) {
				var data = {
					action   : 'woocommerce_subscription_get_user_id_and_token',
					user_id  : customer_id,
					security : wc_payment_gateway_token_editor.actions.get_token.nonce,
				}

				$.ajax({
					url     : wc_payment_gateway_token_editor.ajax_url,
					data    : data,
					type    : 'POST',
					success : function ( response ) {
						if ( response.success ) {
							// Expand billing info interface
							$( '.order_data_column .edit_address' ).filter( ':visible' ).trigger( 'click' );

							// Replace customer id and token if method is woocommerce square
							var { customer_id, token } = response.data || {};
							var token_field            = $( '[name="_payment_method_meta[square_credit_card][post_meta][_wc_square_credit_card_payment_token]"]' );
							var id_field               = $( '[name="_payment_method_meta[square_credit_card][post_meta][_wc_square_credit_card_customer_id]"]' );
							
							if ( customer_id && id_field.val() !== customer_id ) {
								id_field.val( customer_id );
								token_field.val( token );
							}
						}
					}
				});
			}
		});


		return ( handleError = function ( editor, error, message ) {
			if ( message == null ) {
				message = '';
			}
			console.error( error );
			if ( ! message ) {
				message = wc_payment_gateway_token_editor.i18n.general_error;
			}
			return editor
				.find( 'th.actions' )
				.prepend( '<span class="error">' + message + '</span>' );
		} );


	} );
}.call( this ) );

//# sourceMappingURL=sv-wc-payment-gateway-token-editor.min.js.map
