import { postType } from './post.js';
import { reviewType } from './review.js';
import { commentType } from './comment.js';

export const schema = {
  types: [postType, reviewType, commentType],
};
