use crate::contexts::InitializeMint;
use anchor_lang::prelude::*;

pub fn initialize_token_mint(_ctx: Context<InitializeMint>) -> Result<()> {
    msg!("Token mint initialized");
    Ok(())
}
