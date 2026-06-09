import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    key: { type: String, required: true }, // S3 object key
    url: { type: String, required: true }, // public URL
    thumbnailUrl: { type: String },
    width: Number,
    height: Number,
    duration: Number, // seconds, video only
  },
  { _id: false },
)

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    anonymous: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true, trim: true, maxlength: 10000 },
    media: { type: [mediaSchema], default: [] },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'removed'], default: 'active', index: true },
  },
  { timestamps: true },
)

// Feed query: newest active posts.
postSchema.index({ status: 1, createdAt: -1 })

export const Post = mongoose.model('Post', postSchema)
