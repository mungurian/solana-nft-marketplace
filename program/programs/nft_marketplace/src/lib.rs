pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("C9RrLfoPdABJEM7C4xBnjjatjEpvJFyrqdyArPafVE2Q");

#[program]
pub mod nft_marketplace {
    use super::*;

    pub fn list(ctx: Context<List>, price: u64) -> Result<()> {
        instructions::list::handle_list(ctx, price)
    }

    pub fn buy(ctx: Context<Buy>) -> Result<()> {
        instructions::buy::handle_buy(ctx)
    }
}
