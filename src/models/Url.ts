import mongoose, { Document, Schema } from 'mongoose';

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  userId: mongoose.Types.ObjectId;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const isValidUrl = (value: string): boolean => {
  try {
    const url = value.startsWith('http')
      ? new URL(value)
      : new URL(`https://${value}`);

    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

const normalizeUrl = (value: string): string => {
  const url = value.startsWith('http')
    ? new URL(value)
    : new URL(`https://${value}`);

  return url.toString();
};

// Schema
const urlSchema = new Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
      validate: {
        validator: isValidUrl,
        message: 'Please provide a valid URL'
      },
      set: normalizeUrl
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 8
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

urlSchema.index({ userId: 1, createdAt: -1 });

const Url = mongoose.model<IUrl>('Url', urlSchema);

export default Url;
