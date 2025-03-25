use crate::{constants::*, state::CommentAccountState, *};

#[derive(Accounts)]
#[instruction(movie_title:String,comment_text:String,comment_id:String)]
pub struct AddComment<'info> {
    #[account(
        init,
        seeds=["comment".as_bytes(),movie_title.as_bytes(),commenter.key().as_ref(),comment_id.as_bytes()],
        bump,
        payer=commenter,
        space=CommentAccountState::INIT_SPACE+MAX_TITLE_LENGTH+MAX_COMMENT_LENGTH+MAX_COMMENTID_LENGTH
    )]
    pub comment: Account<'info, CommentAccountState>,

    #[account(mut)]
    pub commenter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(movie_title: String,comment_id:String)]
pub struct UpdateComment<'info> {
    #[account(
        mut,
        seeds = ["comment".as_bytes(),movie_title.as_bytes(), commenter.key().as_ref(), comment_id.as_bytes()],
        bump,
        // has_one = commenter // Ensures only the original commenter can update
    )]
    pub comment: Account<'info, CommentAccountState>,

    #[account(mut)]
    pub commenter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl Space for CommentAccountState {
    const INIT_SPACE: usize = ANCHOR_DISCRIMINATOR
        + PUBKEY_SIZE
        + STRING_LENGTH_PREFIX
        + STRING_LENGTH_PREFIX
        + I64_SIZE
        + STRING_LENGTH_PREFIX;
}
