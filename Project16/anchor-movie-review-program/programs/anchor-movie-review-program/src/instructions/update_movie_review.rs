use anchor_lang::prelude::*;

use crate::{constants::*, contexts::UpdateMovieReview, errors::*};

pub fn update_movie_review(
    ctx: Context<UpdateMovieReview>,
    title: String,
    description: String,
    rating: u8,
) -> Result<()> {
    require!(
        rating >= MIN_RATING && rating <= MAX_RATING,
        MovieReviewError::InvalidRating
    );
    require!(
        description.len() <= MAX_DESCRIPTION_LENGTH,
        MovieReviewError::DescriptionTooLong
    );

    msg!("Movie review account space reallocated");
    msg!("Title: {}", title);
    msg!("Description: {}", description);
    msg!("Rating: {}", rating);

    let movie_review = &mut ctx.accounts.movie_review;
    movie_review.description = description;
    movie_review.rating = rating;
    Ok(())
}
