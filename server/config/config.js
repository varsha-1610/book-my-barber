import mongoose from 'mongoose'


const connectDB = async () => {
    try {
        const connection =await  mongoose.connect(process.env.MONGO_URI)
        console.log(`DataBase connected`)

    }catch (err){
        console.log(`Error due to connection DB : ${err.message}`)
    }
}

export default connectDB
