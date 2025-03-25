use anchor_lang::prelude::*;

#[account]
pub struct CommentAccountState {
    pub commenter: Pubkey,
    pub movie_title: String,
    pub comment_text: String,
    pub timestamp: i64,
    pub comment_id: String,
}
