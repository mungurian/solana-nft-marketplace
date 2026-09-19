use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken, token_interface::{
        TransferChecked, 
        CloseAccount, 
        Mint, 
        TokenAccount, 
        TokenInterface, 
        transfer_checked, 
        close_account,
    }
};

use crate::{constants::LISTING_SEED, state::Listing};

#[derive(Accounts)]
pub struct Delist<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        has_one = seller,
        close = seller,
        seeds = [LISTING_SEED, nft_mint.key().as_ref()],
        bump = listing.bump,
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = listing,
    )]
    pub escrow_nft_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = seller,
    )]
    pub seller_nft_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

pub fn handle_delist(ctx: Context<Delist>) -> Result<()> {
    let nft_mint_key = ctx.accounts.nft_mint.key();
    let bump = ctx.accounts.listing.bump;
    let signer_seeds: &[&[u8]] = &[LISTING_SEED, nft_mint_key.as_ref(), &[bump]];
    let signer = &[signer_seeds];
    
    let transfer_nft_account = TransferChecked {
        from: ctx.accounts.escrow_nft_account.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.seller_nft_account.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(), 
        transfer_nft_account, 
        signer,
    );
    transfer_checked(cpi_ctx, 1, ctx.accounts.nft_mint.decimals)?;

    let close_escrow_accounts = CloseAccount {
        account: ctx.accounts.escrow_nft_account.to_account_info(),
        destination: ctx.accounts.seller.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(), 
        close_escrow_accounts, 
        signer
    );
    close_account(cpi_ctx)?;

    msg!(
        "NFT {} delisted by seller {}",
        nft_mint_key,
        ctx.accounts.seller.key(),
    );

    Ok(())
}
