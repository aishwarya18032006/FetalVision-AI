import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const where = req.user.role === 'ADMIN' ? {} : { userId: req.user.id };
    
    if (search) {
      where.prediction = { contains: search, mode: 'insensitive' };
    }

    const predictions = await prisma.prediction.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        doctorNotes: true
      }
    });

    const total = await prisma.prediction.count({ where });

    res.json({
      data: predictions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error retrieving history' });
  }
};

export const getHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prediction = await prisma.prediction.findUnique({
      where: { id: parseInt(id) },
      include: { doctorNotes: true, user: { select: { name: true, email: true } } }
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    if (req.user.role !== 'ADMIN' && prediction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(prediction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prediction = await prisma.prediction.findUnique({
      where: { id: parseInt(id) }
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    if (req.user.role !== 'ADMIN' && prediction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.prediction.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Prediction deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
