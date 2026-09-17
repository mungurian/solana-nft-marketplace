use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use anchor_spl::{
    associated_token::AssociatedToken,
    token_interface::{
        close_account, transfer_checked, CloseAccount, Mint, TokenAccount, TokenInterface,
        TransferChecked,
    },
};

use crate::{constants::LISTING_SEED, state::Listing};

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(mut)]
    pub seller: SystemAccount<'info>,

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
        init_if_needed,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub buyer_nft_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>
}

pub fn handle_buy(ctx: Context<Buy>) -> Result<()> {
    let price = ctx.accounts.listing.price;

    let transfer_sol_to_accounts = Transfer {
        from: ctx.accounts.buyer.to_account_info(),
        to: ctx.accounts.seller.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.key(), 
        transfer_sol_to_accounts
    );
    system_program::transfer(cpi_ctx, price)?;

    let nft_mint_key = ctx.accounts.nft_mint.key();
    let bump = ctx.accounts.listing.bump;
    let signer_seeds: &[&[u8]] = &[LISTING_SEED, nft_mint_key.as_ref(), &[bump]];
    let signer = &[signer_seeds];

    let transfer_nft_accounts = TransferChecked {
        from: ctx.accounts.escrow_nft_account.to_account_info(),
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.buyer_nft_account.to_account_info(),
        authority: ctx.accounts.listing.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.key(), 
        transfer_nft_accounts, 
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
        signer,
    );
    close_account(cpi_ctx)?;

    msg!(
        "NFT {} bought by {} for {} lamports",
        nft_mint_key,
        ctx.accounts.buyer.key(),
        price
    );

    Ok(())
}
