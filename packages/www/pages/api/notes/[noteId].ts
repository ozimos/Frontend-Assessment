import { NextApiRequest, NextApiResponse } from "next";
import { noteController } from "../../../service/controllers";
import { validate } from "../../../service/middlewares";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { method } = req;
	switch (method) {
		case 'GET':
			return await noteController.getOneNote(req, res);
			break;
		case 'PUT':
			return await noteController.updateNote(req, res);
      break;
    case 'DELETE':
      return await noteController.deleteNote(req, res);
      break;
		default:
			return res.status(405).json({
				status: 'error',
				error: `Method ${method} Not Allowed`,
			});
			break;
	}
}

export default validate.notesNoteId(handler);