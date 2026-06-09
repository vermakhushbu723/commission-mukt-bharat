import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    anonymous: { type: Boolean, default: false },
    body: { type: String, required: true, trim: true, maxlength: 4000 },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    // Materialized path of ancestor comment ids (root → ... → direct parent).
    ancestors: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    depth: { type: Number, default: 0 }, // capped at 3 to match the UI
    likeCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'removed'], default: 'active' },
  },
  { timestamps: true },
)

// Fetch a whole thread oldest-first.
commentSchema.index({ post: 1, createdAt: 1 })

export const Comment = mongoose.model('Comment', commentSchema)
