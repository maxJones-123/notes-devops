import { Router } from 'express';
import type { NoteRepository } from '../repositories/NoteRepository';
import { validateNoteInput } from '../validation';

// Each handler does three things only: read the request, call the
// repository, and choose a status code. The rules live elsewhere.
export function createNotesRouter(repository: NoteRepository): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await repository.findAll());
  });

  router.post('/', async (req, res) => {
    const result = validateNoteInput(req.body);
    if (!result.ok) {
      res.status(400).json({ errors: result.errors });
      return;
    }
    const note = await repository.create(result.value);
    res.status(201).json(note);
  });

  router.put('/:id', async (req, res) => {
    // TODO: validate req.body, answer 400 with the errors if invalid
    // TODO: update the note, answer 404 if it does not exist
    // TODO: otherwise answer with the updated note
    const result = validateNoteInput(req.body);
    if (!result.ok) {
      res.status(400).json({ errors: result.errors });
      return;
    }
    const note = await repository.update(req.params.id, result.value);
    if (!note) {
      res.status(404).end();
      return;
    }
    res.json(note);
  });

  router.delete('/:id', async (req, res) => {
    // TODO: delete the note, answer 404 if nothing was deleted
    // TODO: otherwise answer 204 with no body
    const deleted = await repository.delete(req.params.id);
    if (!deleted) {
      res.status(404).end();
      return;
    }
    res.status(204).end();
  });

  return router;
}
