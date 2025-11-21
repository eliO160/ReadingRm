import express from 'express';
import { verifyFirebaseToken } from '../auth.js';
import {
  listLists, createList, renameList, deleteList, addItem, removeItem
} from '../controllers/listsController.js';

const router = express.Router();
router.use(verifyFirebaseToken);

router.get('/', listLists);
router.post('/', createList);
router.patch('/:listId', renameList);
router.delete('/:listId', deleteList);

router.post('/:listId/items', addItem);
router.delete('/:listId/items', removeItem);

export default router;
