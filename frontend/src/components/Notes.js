import React, { useState, useEffect } from 'react';
import { noteAPI } from '../services/api';

const Notes = ({ employeeId }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState('');
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotes();
    }, [employeeId]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await noteAPI.getEmployeeNotes(employeeId);
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) {
            setError('Note cannot be empty');
            return;
        }

        try {
            await noteAPI.createNote(employeeId, newNote);
            setNewNote('');
            setError('');
            fetchNotes();
        } catch (error) {
            setError('Failed to create note');
            console.error('Error creating note:', error);
        }
    };

    const handleUpdateNote = async (noteId) => {
        if (!editContent.trim()) {
            setError('Note cannot be empty');
            return;
        }

        try {
            await noteAPI.updateNote(noteId, editContent);
            setEditingNoteId(null);
            setEditContent('');
            setError('');
            fetchNotes();
        } catch (error) {
            setError('Failed to update note');
            console.error('Error updating note:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) {
            return;
        }

        try {
            await noteAPI.deleteNote(noteId);
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const startEditing = (note) => {
        setEditingNoteId(note.id);
        setEditContent(note.content);
        setError('');
    };

    const cancelEditing = () => {
        setEditingNoteId(null);
        setEditContent('');
        setError('');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows="3"
                />
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                    Add Note
                </button>
            </form>

            {/* Notes List */}
            <div className="space-y-3">
                {notes.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-4">
                        No notes yet
                    </p>
                ) : (
                    notes.map(note => (
                        <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                            {editingNoteId === note.id ? (
                                <div className="space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows="3"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateNote(note.id)}
                                            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEditing}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-700 whitespace-pre-wrap mb-2">
                                        {note.content}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">
                                            {formatDate(note.created_at)}
                                            {note.updated_at !== note.created_at && ' (edited)'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditing(note)}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="text-sm text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;