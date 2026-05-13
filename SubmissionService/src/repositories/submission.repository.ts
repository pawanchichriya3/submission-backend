import { ISubmission, Submission, SubmissionStatus } from "../models/submission.model";

export interface ISubmissionRepository {
    create(submissionData: Partial<ISubmission>): Promise<ISubmission>;
    findById(id: string): Promise<ISubmission | null>;
    findByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;
    updateStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository {
    async create(submissionData: Partial<ISubmission>): Promise<ISubmission> {
        const submission = new Submission(submissionData);
        return await submission.save();
    }
    async findById(id: string): Promise<ISubmission | null> {
        return await Submission.findById(id);
    }
    async findByProblemId(problemId: string): Promise<ISubmission[]> {
        return await Submission.find({ problemId }).sort({ createdAt: -1 });
    }
    async deleteById(id: string): Promise<boolean> {
        const result = await Submission.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }   
    async updateStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        return await Submission.findByIdAndUpdate(id, { status }, { new: true });
    }
}

