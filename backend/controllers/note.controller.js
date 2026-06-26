import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addNote = async (req, res) => {
  try {
    const { predictionId, note } = req.body;

    const prediction = await prisma.prediction.findUnique({
      where: { id: parseInt(predictionId) }
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    if (req.user.role !== 'ADMIN' && prediction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const doctorNote = await prisma.doctorNote.create({
      data: {
        predictionId: parseInt(predictionId),
        note
      }
    });

    res.status(201).json(doctorNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    const doctorNote = await prisma.doctorNote.findUnique({
      where: { id: parseInt(id) },
      include: { prediction: true }
    });

    if (!doctorNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (req.user.role !== 'ADMIN' && doctorNote.prediction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedNote = await prisma.doctorNote.update({
      where: { id: parseInt(id) },
      data: { note }
    });

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const doctorNote = await prisma.doctorNote.findUnique({
      where: { id: parseInt(id) },
      include: { prediction: true }
    });

    if (!doctorNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (req.user.role !== 'ADMIN' && doctorNote.prediction.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.doctorNote.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
