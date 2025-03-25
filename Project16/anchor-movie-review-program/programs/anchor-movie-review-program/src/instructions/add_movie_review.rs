use crate::{constants::*, contexts::AddMovieReview, errors::*};
use anchor_lang::prelude::*;
use anchor_spl::token::{mint_to, MintTo};

pub fn add_movie_review(
    ctx: Context<AddMovieReview>,
    title: String,
    description: String,
    rating: u8,
) -> Result<()> {
    require!(
        rating >= MIN_RATING && rating <= MAX_RATING,
        MovieReviewError::InvalidRating
    );
    require!(
        title.len() <= MAX_TITLE_LENGTH,
        MovieReviewError::TitleTooLong
    );
    require!(
        description.len() <= MAX_DESCRIPTION_LENGTH,
        MovieReviewError::DescriptionTooLong
    );

    msg!("Movie review account created");
    msg!("Title: {}", title);
    msg!("Description: {}", description);
    msg!("Rating: {}", rating);

    let movie_review = &mut ctx.accounts.movie_review;
    movie_review.reviewer = ctx.accounts.initializer.key();
    movie_review.title = title;
    movie_review.description = description;
    movie_review.rating = rating;

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
            },
            &[&["mint".as_bytes(), &[ctx.bumps.mint]]],
        ),
        10 * 10 ^ 6,
    )?;
    Ok(())
}
