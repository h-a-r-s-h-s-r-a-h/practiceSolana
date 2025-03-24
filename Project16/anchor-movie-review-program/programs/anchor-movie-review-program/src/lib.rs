use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

pub mod constants;

pub use constants::*;

declare_id!("89LgxYDDHCMqjKyJ7CXxZRiH93nGQEStekcmgzWWGvGW");

#[program]
pub mod anchor_movie_review_program {
    use super::*;
}


#[derive(Accounts)]
pub struct AddMovieReview<'info>{
    #[account(
        init,
        seeds=[title.as_bytes(),initializer.key().as_ref()],
        bump,
        payer=initializer,
        space=MovieAccountState::INIT_SPACE+title.len()+description.len()
    )]
    pub movie_review:Account<'info,MovieAccountState>,
    #[account(mut)]
    pub initializer:Signer<'info>,
    pub system_program:Program<'info, System>,
    pub token_program:Program<'info,Token>,
    #[account(
        seeds=["mint".as_bytes()],
        bump,
        mut
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init_if_needed,
        payer = initializer,
        associated_token::mint = mint,
        associated_token::authority = initializer
    )]
    pub token_account: Account<'info, TokenAccount>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeMint<'info>{
    #[account(
        init,
        seeds=["mint".as_bytes()],
        bump, 
        payer=user,
        mint::decimals=6,
        mint::authority=mint
    )]
    pub mint: Account<'info,Mint>,
    #[account(mut)]
    pub user:Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MovieAccountState {
    pub reviewer: Pubkey,
    pub rating: u8,
    pub title: String,
    pub description: String,
}

impl Space for MovieAccountState {
    const INIT_SPACE: usize =
        ANCHOR_DISCRIMINATOR + PUBKEY_SIZE + U8_SIZE + STRING_LENGTH_PREFIX + STRING_LENGTH_PREFIX;
}

#[error_code]
enum MovieReviewError {
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Movie title too long")]
    TitleTooLong,
    #[msg("Movie Description too long")]
    DescriptionTooLong,
}
