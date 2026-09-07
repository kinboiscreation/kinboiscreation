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
if (!admin.apps.length) {
  if (process.env.FIREBASE_CONFIG) {
    try {
      const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
      admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: process.env.FIREBASE_DB_URL
      });
      console.log('✅ Firebase initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      process.exit(1);
    }
  } else {
    console.warn('⚠️ FIREBASE_CONFIG not set in environment');
  }
}

const db = admin.firestore();

// ============= Helper Functions =============
async function calculateMonthlyStats(type: string, month: number, year: number) {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const snapshot = await db.collection('activities')
      .where('type', '==', type)
      .where('date', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .where('date', '<=', admin.firestore.Timestamp.fromDate(endDate))
      .get();

    let totalParticipants = 0;
    let menTotal = 0;
    let womenTotal = 0;
    const sessionCount = snapshot.docs.length;

    snapshot.docs.forEach(doc => {
      const data = doc.data();
      totalParticipants += data.totalParticipants || 0;
      menTotal += data.menCount || 0;
      womenTotal += data.womenCount || 0;
    });

    return {
      month,
      year,
      activityType: type,
      totalParticipants,
      sessionCount,
      averageParticipants: sessionCount > 0 ? Math.round(totalParticipants / sessionCount) : 0,
      menTotal,
      menAverage: sessionCount > 0 ? Math.round(menTotal / sessionCount) : 0,
      womenTotal,
      womenAverage: sessionCount > 0 ? Math.round(womenTotal / sessionCount) : 0,
      calculatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error calculating monthly stats:', error);
    throw error;
  }
}

// ============= Routes =============

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebase: !!admin.apps.length
  });
});

// ============= ACTIVITIES ENDPOINTS =============

// POST: Create activity
app.post('/api/activities', async (req: Request, res: Response) => {
  try {
    const { type, date, totalParticipants, menCount, womenCount, sessionNumber, remarks, conductorId } = req.body;

    // Validation
    if (!type || !date || totalParticipants === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const dayOfWeek = dateObj.getDay();

    const activity = {
      type,
      date: admin.firestore.Timestamp.fromDate(dateObj),
      dayOfWeek,
      totalParticipants: Number(totalParticipants),
      menCount: Number(menCount) || 0,
      womenCount: Number(womenCount) || 0,
      sessionNumber: Number(sessionNumber) || 1,
      remarks: remarks || '',
      conductorId: conductorId || null,
      createdBy: 'user@midp.fr', // TODO: Get from auth
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      month,
      year,
      fiscalYear: month >= 8 ? year : year - 1
    };

    const docRef = await db.collection('activities').add(activity);

    // Recalculate monthly stats asynchronously
    calculateMonthlyStats(type, month, year).catch(error => {
      console.error('Error recalculating stats:', error);
    });

    res.status(201).json({
      id: docRef.id,
      ...activity,
      date: activity.date.toDate().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// GET: Activities by type
app.get('/api/activities/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { month, year } = req.query;

    let query = db.collection('activities').where('type', '==', type);

    if (month && year) {
      query = query
        .where('month', '==', Number(month))
        .where('year', '==', Number(year));
    }

    query = query.orderBy('date', 'desc').limit(100);

    const snapshot = await query.get();

    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.()?.toISOString() || data.date,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      };
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET: All activities (with pagination)
app.get('/api/activities', async (req: Request, res: Response) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const snapshot = await db.collection('activities')
      .orderBy('date', 'desc')
      .limit(Number(limit) + 1)
      .offset(Number(offset))
      .get();

    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.()?.toISOString() || data.date,
      };
    });

    res.json({
      activities: activities.slice(0, Number(limit)),
      hasMore: activities.length > Number(limit),
      total: activities.length
    });
  } catch (error) {
    console.error('Error fetching all activities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// ============= STATISTICS ENDPOINTS =============

// GET: Monthly statistics
app.get('/api/stats/monthly/:year/:month', async (req: Request, res: Response) => {
  try {
    const { year, month } = req.params;

    const snapshot = await db.collection('monthly_stats')
      .where('month', '==', Number(month))
      .where('year', '==', Number(year))
      .get();

    if (!snapshot.empty) {
      const stats: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        stats[data.activityType] = {
          totalParticipants: data.totalParticipants,
          sessionCount: data.sessionCount,
          average: data.averageParticipants,
          menTotal: data.menTotal,
          menAverage: data.menAverage,
          womenTotal: data.womenTotal,
          womenAverage: data.womenAverage,
        };
      });
      return res.json(stats);
    }

    // Calculate on-the-fly if not in cache
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const activitiesSnapshot = await db.collection('activities')
      .where('date', '>=', admin.firestore.Timestamp.fromDate(startDate))
      .where('date', '<=', admin.firestore.Timestamp.fromDate(endDate))
      .get();

    const stats: Record<string, any> = {};

    activitiesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const activityType = data.type;

      if (!stats[activityType]) {
        stats[activityType] = {
          totalParticipants: 0,
          sessionCount: 0,
          menTotal: 0,
          womenTotal: 0,
        };
      }

      stats[activityType].totalParticipants += data.totalParticipants || 0;
      stats[activityType].sessionCount += 1;
      stats[activityType].menTotal += data.menCount || 0;
      stats[activityType].womenTotal += data.womenCount || 0;
    });

    // Calculate averages
    Object.keys(stats).forEach(key => {
      const stat = stats[key];
      stat.average = stat.sessionCount > 0 ? Math.round(stat.totalParticipants / stat.sessionCount) : 0;
      stat.menAverage = stat.sessionCount > 0 ? Math.round(stat.menTotal / stat.sessionCount) : 0;
      stat.womenAverage = stat.sessionCount > 0 ? Math.round(stat.womenTotal / stat.sessionCount) : 0;
    });

    res.json(stats);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ============= ANNOUNCEMENTS ENDPOINTS =============

// POST: Create announcement
app.post('/api/announcements', async (req: Request, res: Response) => {
  try {
    const { title, content, scheduledFor, reminderType, aiGenerated, aiPrompt } = req.body;

    const announcement = {
      title,
      content,
      status: 'draft',
      createdBy: 'user@midp.fr', // TODO: Get from auth
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      scheduledFor: scheduledFor ? admin.firestore.Timestamp.fromDate(new Date(scheduledFor)) : null,
      reminderType: reminderType || null,
      reminderEnabled: !!scheduledFor,
      aiGenerated: aiGenerated || false,
      aiPrompt: aiPrompt || null,
      tags: [],
      priority: 'medium'
    };

    const docRef = await db.collection('announcements').add(announcement);

    res.status(201).json({
      id: docRef.id,
      ...announcement,
      scheduledFor: announcement.scheduledFor?.toDate?.()?.toISOString() || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// GET: Announcements
app.get('/api/announcements', async (req: Request, res: Response) => {
  try {
    const { status = 'published', limit = 20 } = req.query;

    let query = db.collection('announcements');

    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(Number(limit))
      .get();

    const announcements = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        scheduledFor: data.scheduledFor?.toDate?.()?.toISOString() || null,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt
      };
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
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
