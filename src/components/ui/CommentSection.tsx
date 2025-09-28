"use client";

import { useState } from "react";
import { Comment } from "../../types/section";
import { Heart, MessageCircle, Reply, Send, User, ChevronDown, ChevronUp } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => void;
  onLikeComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
}

export default function CommentSection({ 
  comments, 
  onAddComment, 
  onLikeComment, 
  onReplyToComment 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim() && replyingTo) {
      onReplyToComment(replyingTo, replyContent.trim());
      setReplyContent("");
      setReplyingTo(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const replies = comments.filter(c => c.parentId === comment.id);

    return (
      <div key={comment.id} className={`${isReply ? 'ml-6 mt-2' : 'mb-3'}`}>
        <div className="bg-slate-800/10 backdrop-blur-sm rounded-lg p-3 border border-slate-700/20">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3 h-3 text-slate-300" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-200 text-xs">{comment.author}</span>
                <span className="text-slate-500 text-xs">{formatDate(comment.date)}</span>
              </div>
              
              <div className="text-slate-300 text-xs leading-relaxed mb-2">
                <MarkdownRenderer content={comment.content} />
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onLikeComment(comment.id)}
                  className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                    comment.isLiked 
                      ? 'text-red-400 hover:text-red-300' 
                      : 'text-slate-500 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
                
                {!isReply && (
                  <button
                    onClick={() => setReplyingTo(comment.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors duration-200"
                  >
                    <Reply className="w-3 h-3" />
                    <span>Odpowiedz</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Formularz odpowiedzi */}
        {replyingTo === comment.id && (
          <form onSubmit={handleSubmitReply} className="mt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Napisz odpowiedź..."
                className="flex-1 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded-md text-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50"
              />
              <button
                type="submit"
                className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md transition-colors duration-200 flex items-center gap-1 text-xs"
              >
                <Send className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors duration-200 text-xs"
              >
                Anuluj
              </button>
            </div>
          </form>
        )}

        {/* Odpowiedzi */}
        {replies.length > 0 && (
          <div className="mt-2">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments.filter(c => !c.parentId);

  return (
    <div className="space-y-3">
      <div 
        className="flex items-center gap-2 mb-3 cursor-pointer hover:bg-slate-800/20 rounded-lg p-2 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <MessageCircle className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-medium text-slate-300">Komentarze</h3>
        <span className="text-slate-500 text-xs">({comments.length})</span>
        <div className="ml-auto">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Formularz dodawania komentarza */}
          <form onSubmit={handleSubmitComment} className="bg-slate-800/20 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30">
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-slate-300" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Dodaj komentarz..."
                  rows={2}
                  className="w-full px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 resize-none"
                />
                <div className="flex justify-end mt-1">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors duration-200 flex items-center gap-1 text-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Wyślij</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Lista komentarzy */}
          <div className="space-y-2">
            {topLevelComments.length === 0 ? (
              <div className="text-center py-6">
                <MessageCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">Brak komentarzy. Bądź pierwszy!</p>
              </div>
            ) : (
              topLevelComments.map(comment => renderComment(comment))
            )}
          </div>
        </>
      )}
    </div>
  );
}
