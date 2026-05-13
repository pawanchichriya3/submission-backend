import { getProblemById } from "../apis/problem.api";
import logger from "../config/logger.config";
import { ISubmission, SubmissionStatus, SubmissionLanguage } from "../models/submission.model";
import { addSubmissionJob } from "../producers/submission.producer";
import { ISubmissionRepository } from "../repositories/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { CreateSubmissionDTO } from "../validators/submission.validator";


export interface ISubmissionService {
    createSubmission(submissionData: CreateSubmissionDTO): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submissionData: CreateSubmissionDTO): Promise<ISubmission> {
        // validate presence of submission data
        if(!submissionData) {
            throw new BadRequestError("Submission data is required");
        }

        const problem = await getProblemById(submissionData.problemId);
        if(!problem) {
            throw new NotFoundError("Problem not found or something went wrong");
        }
        const submission = await this.submissionRepository.create(submissionData as Partial<ISubmission>);

        // submission to redis queue
        const jobId = await addSubmissionJob({
            submissionId: submission.id,
            problem,
            code: submissionData.code,
            language: submissionData.language as SubmissionLanguage
        });

        logger.info(`Submission job added: ${jobId}`);

        return submission;

    }
    async getSubmissionById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findById(id);
        if(!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }

    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findByProblemId(problemId);
        return submissions;
    }

    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = await this.submissionRepository.deleteById(id);
        if(!result) {
            throw new NotFoundError("Submission not found");
        }
        return result;
    }

    async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateStatus(id, status);
        if(!submission) {
            throw new NotFoundError("Submission not found");
        }
        return submission;
    }

}