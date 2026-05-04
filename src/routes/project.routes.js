const express = require('express')
const router = express.Router()
const { createProject, getProjects, getProject, updateProject, deleteProject, getArchivedProjects, restoreProject } = require('../controllers/project.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate')
const { projectSchema, updateProjectSchema } = require('../validators/project.validator')

router.use(protect)

router.get('/archived', getArchivedProjects)
router.patch('/:id/restore', restoreProject)
router.post('/', validate(projectSchema), createProject)
router.get('/', getProjects)
router.get('/:id', getProject)
router.put('/:id', validate(updateProjectSchema), updateProject)
router.delete('/:id', deleteProject)

module.exports = router