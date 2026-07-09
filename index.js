import 'dotenv/config';

import express from 'express';

import connectDB from './db.js';

import Grade from './models/grades.js'

const app = express();

const port = 3000;

app.get('/', async (req, res) => {

    // db.grades.aggregate() <- MongoDB driver syntax

    const result = await Grade.aggregate(
        // Pipeline (array)
        [
            // Stage 1 (object)
            {
                $project: {
                    class_id: 1,
                    average: {
                        $avg: "$scores.score"
                    }
                }
            },
            // Stage 2 (object)
            {
                $limit: 3
            }
        ]
    ) // <- Mongoose syntax

    res.send(result);
})

// Part 2: Adding Additional Features - Create a GET route at /grades/stats

app.get("/grades/stats", async (req, res) => {

/* Part 2: Adding Additional Features - Within this route, create an aggregation pipeline that returns: 1. learners with a weighted average higher than 70%.
2. Total number of learners. 3. Percentage of learners with an average above 70%. */

    const result = await Grade.aggregate(
        [
            {
                $project:
                /* specifications: The fields to include or exclude. */
                {
                    average: {
                        $avg: "$scores.score"
                    }
                }
            },

            {
                $match:
                /* query: The query in MQL. */
                {
                    average: {
                        $gt: 70
                    }
                }
            },

            {
                $count:
                /* Provide the field name for the count. */
                "learnersAbove70"
            }
        ]
    )

    const learnersAbove70 = result.length > 0 ? result[0].learnersAbove70 : 0;
    const totalLearners = await Grade.countDocuments();
    const percentageAbove70 = (learnersAbove70 / totalLearners) * 100;

    res.send(

        {

            learnersAbove70,
            totalLearners,
            percentageAbove70

        }

    )

}
)

// Part 2: Adding Additional Features - Create a GET route at /grades/stats/:id

app.get("/grades/stats/:id", async (req, res) => {

/* Part 2: Adding Additional Features - Within this route, mimic the above aggregation pipeline, but only for learners within a class that has a class_id equal to the specified :id. */

    const result = await Grade.aggregate(

        [
            {
                $match:
                /* query: The query in MQL. */
                {
                    class_id: {
                        $eq: Number(req.params.id)
                    }
                }
            },
            {
                $project:
                /* specifications: The fields to include or exclude. */
                {
                    class_id: 1,
                    average: {
                        $avg: "$scores.score"
                    }
                }
            },
            {
                $match:
                /* query: The query in MQL. */
                {
                    average: {
                        $gt: 70
                    }
                }
            },
            {
                $count:
                /* Provide the field name for the count. */
                "learnersAbove70"
            }
        ]
    )

    const learnersAbove70 = result.length > 0 ? result[0].learnersAbove70 : 0;
    const totalLearners = await Grade.countDocuments({ class_id: Number(req.params.id) });
    const percentageAbove70 = (learnersAbove70 / totalLearners) * 100;

    res.send(

        {

            learnersAbove70,
            totalLearners,
            percentageAbove70

        }

    )
}
)

app.listen(port, () => {
    console.log('Listening on port: ' + port);
    connectDB();
})



