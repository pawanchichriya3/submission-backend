import mongoose from "mongoose";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblem {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testCases: ITestCase[];
}

const testSchema = new mongoose.Schema<ITestCase>({
    input: {
        type: String,
        required: [true, "Input is required"],
        trim: true,
    },
    output: {
        type: String,
        required: [true, "Output is required"],
        trim: true,
    },
}, {
    // _id: false // can be enabled if we don't want to use the default _id field
})

const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, "Title is required"],
        maxLength: [100, "Title must be less than 100 characters"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    difficulty: {
        type: String,
        required: [true, "Difficulty is required"],
        enum: {
            values: ["Easy", "Medium", "Hard"],
            message: "Invalid difficulty level",
        },
    },  
    editorial: {
        type: String,
        trim: true,
    },
    testCases: {
        type: [testSchema],
        required: [true, "At least one test case is required"],
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (_: any, record: any) => {
            delete record.__v; // delete __v field
            record.id = record._id; // add id field
            delete record._id; // delete _id field
            return record;
        }
    }
});

problemSchema.index({ title: 1 }, { unique: true }); // index on title field
problemSchema.index({ difficulty: 1 }); // index on difficulty field

export const Problem = mongoose.model<IProblem>("Problem", problemSchema);

