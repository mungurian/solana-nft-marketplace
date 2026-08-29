use anchor_lang::prelude::*;

#[error_code]
pub enum MarketplaceError {
    #[msg("Price must be greater than zero")]
    InvalidPrice,
}
