use crate::contexts::DeleteMovieReview;
use anchor_lang::prelude::*;

pub fn delete_movie_review(_ctx: Context<DeleteMovieReview>, title: String) -> Result<()> {
    msg!("Movie review for {} deleted", title);
    Ok(())
}
