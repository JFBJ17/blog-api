import mongoose from 'mongoose'

export async function connectDB () {
  try {
    await mongoose.connect(
      'mongodb+srv://cheo:josephF20@cluster0.ij5uu40.mongodb.net/?retryWrites=true&w=majority'
    )
    console.log('MongoDB is connected')
  } catch (error) {
    console.error(error)
  }
}
