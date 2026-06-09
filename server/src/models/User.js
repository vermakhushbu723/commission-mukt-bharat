import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, index: true },
    username: { type: String, unique: true, sparse: true, trim: true },
    displayName: { type: String, trim: true },
    avatarUrl: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
)

// Has the user finished onboarding (picked a username)?
userSchema.virtual('profileComplete').get(function () {
  return Boolean(this.username && this.displayName)
})

export const User = mongoose.model('User', userSchema)
