import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// ============= Middleware =============
app.use(cors());
app.use(express.json());

// ============= Firebase Setup =============
if (process.env.FIREBASE_CONFIG) {
  const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DB_URL
  });
}

const db = admin.firestore();

// ============= Routes =============

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Activities
app.post('/api/activities', async (req: Request, res: Response) => {
  try {
    const { type, date, totalParticipants, menCount, womenCount, sessionNumber, remarks } = req.body;

    const activity = {
      type,
      date,
      totalParticipants,
      menCount,
      womenCount,
      sessionNumber,
      remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('activities').add(activity);
    res.status(201).json({ id: docRef.id, ...activity });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/activities/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const snapshot = await db.collection('activities')
      .where('type', '==', type)
      .orderBy('date', 'desc')
      .get();

    const activities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Monthly Statistics
app.get('/api/stats/monthly/:year/:month', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const snapshot = await db.collection('activities')
      .where('date', '>=', startDate.toISOString())
      .where('date', '<=', endDate.toISOString())
      .get();

    const stats: Record<string, any> = {};

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      const activityType = data.type;

      if (!stats[activityType]) {
        stats[activityType] = {
          totalParticipants: 0,
          sessionCount: 0,
          menCount: 0,
          womenCount: 0
        };
      }

      stats[activityType].totalParticipants += data.totalParticipants || 0;
      stats[activityType].sessionCount += 1;
      stats[activityType].menCount += data.menCount || 0;
      stats[activityType].womenCount += data.womenCount || 0;
    });

    // Calculate averages
    Object.keys(stats).forEach(key => {
      const stat = stats[key];
      stat.average = stat.sessionCount > 0 ? Math.round(stat.totalParticipants / stat.sessionCount) : 0;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Announcements
app.post('/api/announcements', async (req: Request, res: Response) => {
  try {
    const { title, content, scheduledFor, reminderType } = req.body;

    const announcement = {
      title,
      content,
      scheduledFor: scheduledFor || null,
      reminderType: reminderType || null,
      reminderEnabled: !!scheduledFor,
      status: 'draft',
      aiGenerated: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('announcements').add(announcement);
    res.status(201).json({ id: docRef.id, ...announcement });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/announcements', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection('announcements')
      .where('status', '!=', 'archived')
      .orderBy('status')
      .orderBy('createdAt', 'desc')
      .get();

    const announcements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============= Error Handler =============
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============= Server Start =============
app.listen(PORT, () => {
  console.log(`🙏 MIDP Backend running on port ${PORT}`);
});
