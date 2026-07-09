import mongoose from 'mongoose';

/* 1. Changed scores.scores to score.score to match the database.
2. Changed learner_id to student_id to match the sample data in my Atlas, after we learned during the lab that the datasets for each of us showed differently.
3. Changed student_id type: String to type: Number to match DB.
*/

const gradeSchema = new mongoose.Schema({
    scores: [
        {
            type: { type: String },
            // scores: { type: Number }
            score: { type: Number }
        }
    ],
    
    class_id: {
        type: Number,
        required: true
    },
    student_id: {
        // type: String,
        type: Number,
        required: true
    }
})

export default mongoose.model("grade", gradeSchema, "grades");