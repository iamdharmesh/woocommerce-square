import { test, expect } from '@playwright/test';
import { chromium } from 'playwright';

import {
	createProduct,
	doesProductExist,
	saveSquareSettings,
	deleteAllProducts,
} from '../utils/helper';
import {
	listCatalog,
	deleteAllCatalogItems,
	retrieveInventoryCount,
	extractCatalogInfo,
	clearSync,
} from '../utils/square-sandbox';

test.describe.configure( { mode: 'serial' } );
test.beforeAll( 'Setup', async ( ) => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	await deleteAllProducts( page );
	await deleteAllCatalogItems();

	await page.goto( '/wp-admin/admin.php?page=wc-settings&tab=square&section' );

	await page.getByTestId( 'sync-settings-field' ).selectOption( { label: 'WooCommerce' } );
	await page.getByTestId( 'push-inventory-field' ).check();
	await saveSquareSettings( page );

	await clearSync( page );
	await browser.close();
} );

test( 'OnePlus 8 pushed to Square with inventory (New Editor) @sync', async ( { page, baseURL } ) => {
	test.slow();

	if ( ! ( await doesProductExist( baseURL, 'oneplus-8' ) ) ) {
		await createProduct(
			page, {
				name: 'OnePlus 8',
				regularPrice: '299',
				sku: 'oneplus-8',
			},
			false,
			true // Specific to New Product Block Editor
		);

		if ( await page.locator( '[aria-label="Close Tour"]' ).isVisible() ) {
			await page.locator( '[aria-label="Close Tour"]' ).click();
		}

		/**
		 * New Product Block Editor
		 */
		try {
			await page.locator( '.wc-square-track-quantity .components-form-toggle__input' ).click();
			await page.locator( '[name="stock_quantity"]' ).fill( '62' );

			await page.locator( '#woocommerce-product-tab__general' ).click();
			await page.locator( '[data-template-block-id="_wc_square_synced"] .components-form-toggle__input' ).click();

			await page
				.locator( '.woocommerce-product-header__actions .components-button' )
				.filter( { hasText: 'Publish' } )
				.click();

			await expect( await page.getByText( 'Product published.' ).first() ).toBeVisible();
		} catch ( error ) {
			await page.screenshot( { path: 'error-adding-product-screenshot.png' } );
			throw error;
		}
	}

	await page.goto( '/wp-admin/admin.php?page=wc-settings&tab=square&section=update' );

	const MAX_PROCESSING_TIME = 90000;
	const POLLING_INTERVAL = 3000;

	const getCatalogData = async () => {
		const result = await listCatalog();
		return result;
	};

	await page.exposeFunction( 'getCatalogData', getCatalogData );

	const startTime = Date.now();
	let catalogData = null;

	while ( Date.now() - startTime < MAX_PROCESSING_TIME ) {
		const result = await getCatalogData();
		if ( result?.objects?.length > 0 ) {
			catalogData = result;
			break;
		}
		await page.waitForTimeout( POLLING_INTERVAL );
	}

	if ( ! catalogData ) {
		throw new Error( `No catalog items found after ${MAX_PROCESSING_TIME}ms of polling` );
	}

	const { name, variations } = extractCatalogInfo( catalogData.objects[0] );

	expect( name ).toEqual( 'OnePlus 8' );
	expect( variations[0].sku ).toEqual( 'oneplus-8' );
	expect( variations[0].price ).toEqual( 29900 );

	let inventory = await retrieveInventoryCount( variations[0].id );

	if ( ! inventory.counts ) {
		await page.exposeFunction( 'retrieveInventoryCountInPage', retrieveInventoryCount );

		inventory = await page.waitForFunction(
			async ( variationId ) => {
				const inventoryData = await window.retrieveInventoryCountInPage( variationId );
				return inventoryData.counts ? inventoryData : null;
			},
			variations[0].id,
			{
				timeout: MAX_PROCESSING_TIME,
				polling: POLLING_INTERVAL,
			}
		).then( ( result ) => result.jsonValue() );
	}

	expect( inventory ).toHaveProperty( 'counts' );
	expect( inventory ).toHaveProperty( 'counts[0].quantity', '62' );
} );

test( 'Update inventory from Woo to Square @sync', async ( { page } ) => {
	await page.goto( '/wp-admin/edit.php?post_type=product' );
	await page
		.locator( 'a.row-title' )
		.filter( { hasText: 'OnePlus 8' } )
		.click();

	await page.locator( '#woocommerce-product-tab__inventory' ).click();
	await expect( await page.locator( '[name="stock_quantity"]' ) ).toBeDisabled();

	await page
		.locator( 'button.components-button' )
		.filter( { hasText: 'Fetch stock from Square' } )
		.click();

	await expect( await page.locator( '[name="stock_quantity"]' ) ).toBeEnabled();
	await page.locator( '[name="stock_quantity"]' ).fill( '84' );

	await page
		.locator( '.woocommerce-button-with-dropdown-menu .components-button' )
		.filter( { hasText: 'Update' } )
		.click();

	// await expect( await page.getByText( 'Product updated.' ) ).toBeVisible();

	const result = await new Promise( ( resolve ) => {
		let intervalId = setInterval( async () => {
			const __result = await listCatalog();
			if ( __result.objects ) {
				clearInterval( intervalId );
				resolve( __result );
			}
		}, 3000 );
	} );

	const { variations } = extractCatalogInfo( result.objects[0] );
	let inventory = await retrieveInventoryCount( variations[ 0 ].id );

	if ( ! inventory.counts ) {
		await new Promise( ( resolve ) => {
			const inventoryIntervalId = setInterval( async () => {
				inventory = await retrieveInventoryCount( variations[ 0 ].id );
				if ( inventory.counts ) {
					clearInterval( inventoryIntervalId );
					resolve();
				}
			}, 4000 );
		} );
	}

	expect( inventory ).toHaveProperty( 'counts' );
	expect( inventory ).toHaveProperty( 'counts[0].quantity', '84' );
} );
