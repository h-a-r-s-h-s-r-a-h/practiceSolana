use anchor_lang::prelude::*;

use crate::{constants::*, contexts::UpdateComment, errors::*};

pub fn update_comment(
    ctx: Context<UpdateComment>,
    _movie_title: String,
    _comment_id: String,
    new_comment_text: String,
) -> Result<()> {
    require!(
        new_comment_text.len() <= MAX_COMMENT_LENGTH,
        CommentReviewError::CommentTooLong
    );
    let comment = &mut ctx.accounts.comment;
    comment.comment_text = new_comment_text;
    comment.timestamp = Clock::get()?.unix_timestamp;

    msg!("Comment updated successfully!");
    Ok(())
}
