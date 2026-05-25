import { Router } from 'express';
import { Project } from '../models/Project';
import { authenticate, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate as any);

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, domain } = req.body;
    const project = new Project({
      name,
      domain,
      organizationId: req.user?.organizationId
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const projects = await Project.find({ organizationId: req.user?.organizationId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

export default router;
