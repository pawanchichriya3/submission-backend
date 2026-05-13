import express from 'express';
import SubmissionController from '../../controllers/submission.controller';
import { validateRequestBody, validateQueryParams } from '../../validators';
import { createSubmissionSchema, updateStatusSchema, submissionsQuerySchema } from '../../validators/submission.validator';

const submissionRouter = express.Router();

// Create a submission
submissionRouter.post('/', validateRequestBody(createSubmissionSchema), SubmissionController.createSubmission);

// Get submissions by optional query `?problemId=` or by route param
submissionRouter.get('/', validateQueryParams(submissionsQuerySchema), SubmissionController.getSubmissionsByProblemId);
submissionRouter.get('/problem/:problemId', SubmissionController.getSubmissionsByProblemId);

// Get, delete, and update status by id
submissionRouter.get('/:id', SubmissionController.getSubmissionById);
submissionRouter.delete('/:id', SubmissionController.deleteSubmission);
submissionRouter.patch('/:id/status', validateRequestBody(updateStatusSchema), SubmissionController.updateSubmissionStatus);

export default submissionRouter;
