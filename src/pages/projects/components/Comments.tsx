import React, { useState } from 'react';
import { format } from 'date-fns';
import { CommentsProps } from '../../../types/comments';
import { useCreateCommentMutation } from '../../../redux/features/commentApi';

const Comments: React.FC<CommentsProps> = ({ projectId, comments = [], page, totalPages, setPage, isLoading }) => {
  const [createComment, { isLoading: isCreating }] = useCreateCommentMutation();
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await createComment({ projectId, message: newMessage }).unwrap();
      setNewMessage('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg shadow-md bg-background p-4 w-full">
        <p className="text-textSecondary">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">

      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={1}
          className="w-full border border-border rounded p-2 focus:outline-none focus:ring focus:ring-primary bg-backgroundShade1 text-text"
          placeholder="Write a comment..."
          disabled={isCreating}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-primary text-textHover rounded  disabled:opacity-50 transition"
          disabled={isCreating || !newMessage.trim()}
        >
          {isCreating ? 'Posting...' : 'Add Comment'}
        </button>
      </form>

      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border border-border rounded p-3 bg-backgroundShade1">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-backgroundShade2 rounded-full flex-shrink-0 flex items-center justify-center text-textSecondary">
                  {comment.user?.displayName
                    ? comment.user.displayName.charAt(0).toUpperCase()
                    : comment.userId.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-text">
                    {comment.user?.displayName || 'Anonymous'}
                  </p>
                  <p className="text-xs text-textSecondary">
                    {comment.createdAt
                      ? format(new Date(comment.createdAt), 'MMM d, yyyy h:mm a')
                      : 'Unknown date'}
                  </p>
                </div>
              </div>
              <p className="text-text">{comment.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-textSecondary">No comments yet.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="px-3 py-1 bg-backgroundShade1 border border-border rounded text-textSecondary disabled:opacity-50 hover:bg-backgroundShade2 transition"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="text-sm text-textSecondary">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-backgroundShade1 border border-border rounded text-textSecondary disabled:opacity-50 hover:bg-backgroundShade2 transition"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Comments;
