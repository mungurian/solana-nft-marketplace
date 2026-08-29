use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{Mint, TokenAccount, TokenInterface, TransferChecked, transfer_checked},
};

use crate::{constants::LISTING_SEED, error::MarketplaceError, state::Listing};

#[derive(Accounts)]
pub struct List<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init,
        payer = seller,
        space = 8 + Listing::INIT_SPACE,
        seeds = [LISTING_SEED, nft_mint.key().as_ref()],
        bump,
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = seller,
    )]
    pub seller_nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = seller,
        associated_token::mint = nft_mint,
        associated_token::authority = listing,
    )]
    pub escrow_nft_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_list(ctx: Context<List>, price: u64) -> Result<()> {
    require!(price > 0, MarketplaceError::InvalidPrice);

    let listing = &mut ctx.accounts.listing;

    listing.seller = ctx.accounts.seller.key();
    listing.nft_mint = ctx.accounts.nft_mint.key();
    listing.price = price;
    listing.bump = ctx.bumps.listing;

    let cpi_accounts = TransferChecked {
        from: ctx.accounts.seller_nft_account.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.escrow_nft_account.to_account_info(),
        authority: ctx.accounts.seller.to_account_info(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.key(),
        cpi_accounts,
    );

    transfer_checked(cpi_ctx, 1, ctx.accounts.nft_mint.decimals)?;

    msg!("NFT {} listed for {} lamports", listing.nft_mint, price);
    Ok(())
}
