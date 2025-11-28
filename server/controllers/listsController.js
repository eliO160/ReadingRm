import UserList from '../models/UserList.js';

export async function listLists(req, res) {
  const uid = req.user.uid;
  const docs = await UserList.find({ userId: uid }).lean();
  res.json(docs);
}

export async function createList(req, res) {
  const uid = req.user.uid;
  const { name } = req.body;
  const doc = await UserList.create({ userId: uid, name: name?.trim(), items: [] });
  res.status(201).json(doc);
}

export async function renameList(req, res) {
  const uid = req.user.uid;
  const { listId } = req.params;
  const { name } = req.body;
  const doc = await UserList.findOneAndUpdate(
    { _id: listId, userId: uid },
    { $set: { name: name?.trim() } },
    { new: true }
  ).lean();
  res.json(doc);
}

export async function deleteList(req, res) {
  const uid = req.user.uid;
  const { listId } = req.params;
  await UserList.deleteOne({ _id: listId, userId: uid });
  res.sendStatus(204);
}

export async function addItem(req, res) {
  const uid = req.user.uid;
  const { listId } = req.params;
  const { bookId } = req.body;
  const doc = await UserList.findOneAndUpdate(
    { _id: listId, userId: uid, 'items.bookId': { $ne: bookId } },
    { $push: { items: { bookId } } },
    { new: true }
  ).lean();
  res.json(doc);
}

export async function removeItem(req, res) {
  const uid = req.user.uid;
  const { listId } = req.params;
  const { bookId } = req.body;
  const doc = await UserList.findOneAndUpdate(
    { _id: listId, userId: uid },
    { $pull: { items: { bookId } } },
    { new: true }
  ).lean();
  res.json(doc);
}
