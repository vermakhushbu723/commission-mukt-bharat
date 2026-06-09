import mongoose from 'mongoose'

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['post', 'comment'], required: true },
    target: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
)

// One like per user per target — blocks double-likes at the DB level.
likeSchema.index({ user: 1, targetType: 1, target: 1 }, { unique: true })
likeSchema.index({ targetType: 1, target: 1 })

export const Like = mongoose.model('Like', likeSchema)
