use anchor_lang::prelude::*;

mod constants;
mod contexts;
mod errors;
mod instructions;
mod state;

use contexts::*;
use instructions::*;


declare_id!("89LgxYDDHCMqjKyJ7CXxZRiH93nGQEStekcmgzWWGvGW");

#[program]
pub mod anchor_movie_review_program {
    use super::*;

    pub fn add_movie_review(
        ctx: Context<AddMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        instructions::add_movie_review::add_movie_review(ctx, title, description, rating)
    }

    pub fn update_movie_review(
        ctx: Context<UpdateMovieReview>,
        title: String,
        description: String,
        rating: u8,
    ) -> Result<()> {
        update_movie_review::update_movie_review(ctx, title, description, rating)
    }

    pub fn delete_movie_review(ctx: Context<DeleteMovieReview>, title: String) -> Result<()> {
        delete_movie_review::delete_movie_review(ctx, title)
    }

    pub fn add_comment(
        ctx: Context<AddComment>,
        movie_title: String,
        comment_text: String,
        comment_id: String,
    ) -> Result<()> {
        add_comment::add_comment(ctx, movie_title, comment_text, comment_id)
    }

    pub fn update_comment(
        ctx: Context<UpdateComment>,
        movie_title: String,
        comment_id: String,
        new_comment_text: String,
    ) -> Result<()> {
        update_comment::update_comment(ctx, movie_title, comment_id, new_comment_text)
    }

    pub fn initialize_token_mint(ctx: Context<InitializeMint>) -> Result<()> {
        initialize_mint::initialize_token_mint(ctx)
    }
}
