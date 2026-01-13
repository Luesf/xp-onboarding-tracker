const noteModel = require('../models/noteModel');

const noteController = {
    getEmployeeNotes: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const notes = await noteModel.getByEmployeeId(employeeId);
            res.json(notes);
        } catch (error) {
            console.error('Error fetching notes:', error);
            res.status(500).json({ error: 'Failed to fetch notes' });
        }
    },
    createNote: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const { content } = req.body;
            if (!content || !content.trim()) {
                return res.status(400).json({ error: 'Note content is required' });
            }
            const note = await noteModel.create(employeeId, content);
            req.io.emit('noteCreated', { employeeId: parseInt(employeeId), note });
            res.status(201).json(note);
        } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).json({ error: 'Failed to create note' });
        }
    },
    updateNote: async (req, res) => {
        try {
            const { noteId } = req.params;
            const { content } = req.body;
            if (!content || !content.trim()) {
                return res.status(400).json({ error: 'Note content is required' });
            }
            const note = await noteModel.update(noteId, content);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            req.io.emit('noteUpdated', note);
            res.json(note);
        } catch (error) {
            console.error('Error updating note:', error);
            res.status(500).json({ error: 'Failed to update note' });
        }
    },
    deleteNote: async (req, res) => {
        try {
            const { noteId } = req.params;
            const note = await noteModel.delete(noteId);
            if (!note) {
                return res.status(404).json({ error: 'Note not found' });
            }
            req.io.emit('noteDeleted', { noteId: parseInt(noteId), employeeId: note.employee_id });
            res.json({ message: 'Note deleted successfully' });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).json({ error: 'Failed to delete note' });
        }
    }
};

module.exports = noteController;