use anchor_lang::prelude::*;

use crate::{constants::*, contexts::AddComment, errors::*};

pub fn add_comment(
    ctx: Context<AddComment>,
    movie_title: String,
    comment_text: String,
    comment_id: String,
) -> Result<()> {
    require!(
        comment_text.len() <= MAX_COMMENT_LENGTH,
        CommentReviewError::CommentTooLong
    );

    require!(
        movie_title.len() <= MAX_TITLE_LENGTH,
        CommentReviewError::CommentMovieTitleTooLong
    );

    require!(
        comment_id.len() <= MAX_COMMENTID_LENGTH,
        CommentReviewError::CommentIDTooLong
    );

    let comment = &mut ctx.accounts.comment;

    comment.commenter = ctx.accounts.commenter.key();
    comment.movie_title = movie_title;
    comment.comment_text = comment_text;
    comment.timestamp = Clock::get()?.unix_timestamp;
    comment.comment_id = comment_id;

    msg!("Comment added successfully!");
    Ok(())
}
