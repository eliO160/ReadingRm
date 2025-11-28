import UserPref from '../models/UserPref.js';

export async function getPrefs(req, res) {
  const uid = req.user.uid; // set by verifyFirebaseToken
  const doc = await UserPref.findOne({ userId: uid }).lean();
  res.json(doc?.prefs ?? {}); // return {} if none saved yet
}

export async function updatePrefs(req, res) {
  const uid = req.user.uid;
  const incoming = req.body?.prefs ?? {};
  const doc = await UserPref.findOneAndUpdate(
    { userId: uid },
    { $set: { prefs: incoming, userId: uid } },
    { new: true, upsert: true }
  ).lean();
  res.json(doc.prefs);
}
