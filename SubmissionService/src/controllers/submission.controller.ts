import { Request, Response } from "express";
import { SubmissionRepository } from "../repositories/submission.repository";
import { SubmissionService } from "../services/submission.service";
import { CreateSubmissionDTO, UpdateStatusDTO } from "../validators/submission.validator";
import { SubmissionStatus } from "../models/submission.model";

const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);

export const SubmissionController = {

	async createSubmission(req: Request, res: Response): Promise<void> {
		const payload = req.body as CreateSubmissionDTO;
		const submission = await submissionService.createSubmission(payload);

		res.status(201).json({
			message: "Submission created successfully",
			data: submission,
			success: true
		});
	},

	async getSubmissionById(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.getSubmissionById(req.params.id);

		res.status(200).json({
			message: "Submission fetched successfully",
			data: submission,
			success: true
		});
	},

	async getSubmissionsByProblemId(req: Request, res: Response): Promise<void> {
		const problemId = (req.params.problemId as string) || (req.query.problemId as string);
		const submissions = await submissionService.getSubmissionsByProblemId(problemId);

		res.status(200).json({
			message: "Submissions fetched successfully",
			data: submissions,
			success: true
		});
	},

	async deleteSubmission(req: Request, res: Response): Promise<void> {
		const result = await submissionService.deleteSubmissionById(req.params.id);

		res.status(200).json({
			message: "Submission deleted successfully",
			data: result,
			success: true
		});
	},

	async updateSubmissionStatus(req: Request, res: Response): Promise<void> {
		const body = req.body as UpdateStatusDTO;
		const status = body.status as SubmissionStatus;
		const submission = await submissionService.updateSubmissionStatus(req.params.id, status);

		res.status(200).json({
			message: "Submission status updated successfully",
			data: submission,
			success: true
		});
	}

}

export default SubmissionController;