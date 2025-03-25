use anchor_lang::prelude::*;

#[error_code]
pub enum CommentReviewError {
    #[msg("Movie title too long")]
    CommentMovieTitleTooLong,
    #[msg("Comment Description too long")]
    CommentTooLong,
    #[msg("Comment ID too long")]
    CommentIDTooLong,
}

#[error_code]
pub enum MovieReviewError {
    #[msg("Rating must be between 1 and 5")]
    InvalidRating,
    #[msg("Movie title too long")]
    TitleTooLong,
    #[msg("Movie Description too long")]
    DescriptionTooLong,
}
