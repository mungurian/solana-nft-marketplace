use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("Price must be greater than zero")]
    InvalidPrice,

    #[msg("Seller cannot buy their own listing")]
    CannotBuyOwnListing,
}
