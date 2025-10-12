"use client";

import { useState } from "react";
import { Comment } from "../../types/section";
import { Heart, MessageCircle, Reply, Send, User, ChevronDown, ChevronUp, Github } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSession, signIn, signOut } from "next-auth/react";

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string, isAnonymous?: boolean, displayName?: string) => void;
  onLikeComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
}

export default function CommentSection({ 
  comments, 
  onAddComment, 
  onLikeComment, 
  onReplyToComment 
}: CommentSectionProps) {
  const { data: session, status } = useSession();
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousNickname, setAnonymousNickname] = useState("");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Check if user is logged in
      if (!session) {
        // Show login modal instead of redirecting
        setShowLoginModal(true);
        return;
      }
      
      try {
        await onAddComment(newComment.trim(), undefined, false);
        setNewComment("");
      } catch (error) {
        console.error('Error adding comment:', error);
        
        // Check if error is related to authentication
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('invalid') || errorMessage.includes('expired') || errorMessage.includes('Authentication failed')) {
          console.log('Authentication error detected, showing login modal');
          setShowLoginModal(true);
        }
      }
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim() && replyingTo) {
      // Check if user is logged in
      if (!session) {
        // Show login modal instead of redirecting
        setShowLoginModal(true);
        return;
      }
      
      try {
        await onReplyToComment(replyingTo, replyContent.trim());
        setReplyContent("");
        setReplyingTo(null);
      } catch (error) {
        console.error('Error adding reply:', error);
        
        // Check if error is related to authentication
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('invalid') || errorMessage.includes('expired') || errorMessage.includes('Authentication failed')) {
          console.log('Authentication error detected, showing login modal');
          setShowLoginModal(true);
        }
      }
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
            {comment.avatar ? (
              <img 
                src={comment.avatar} 
                alt={`${comment.author} avatar`} 
                className="w-5 h-5 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-slate-300" />
              </div>
            )}
            
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
              {session?.githubAvatar ? (
                <img 
                  src={session.githubAvatar} 
                  alt="User avatar" 
                  className="w-6 h-6 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-slate-300" />
                </div>
              )}
              <div className="flex-1">
                    {session ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span>
                          Zalogowany jako: <span className="text-blue-400">{session.user?.name || session.githubUsername || 'GitHub User'}</span>
                        </span>
                        <button
                          onClick={() => signOut()}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 text-xs"
                        >
                          Wyloguj
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mb-1">
                        Napisz komentarz i kliknij "Wyślij" aby się zalogować
                      </div>
                    )}
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Napisz komentarz..."
                    className="flex-1 h-8 px-2 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-8 h-8 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
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

          {/* Modal do logowania */}
          {showLoginModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700/30">
                <div className="text-center mb-6">
                  <Github className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Wybierz sposób komentowania
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Możesz się zalogować lub komentować anonimowo
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Opcja logowania przez GitHub */}
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      // Store the current URL and comment for after login
                      localStorage.setItem('pendingComment', JSON.stringify({
                        content: newComment,
                        parentId: replyingTo,
                        url: window.location.pathname
                      }));
                      signIn('github', { callbackUrl: window.location.pathname });
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors duration-200 border border-slate-600/50"
                  >
                    <Github className="w-5 h-5" />
                    <span>Zaloguj się przez GitHub</span>
                  </button>

                  {/* Opcja anonimowego komentowania */}
                  <div className="space-y-2">
                    <div className="text-center text-slate-400 text-sm">lub</div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={anonymousNickname}
                        onChange={(e) => setAnonymousNickname(e.target.value)}
                        placeholder="Podaj nick (opcjonalnie)"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400/50 focus:border-blue-400/50"
                      />
                      
                      <button
                        onClick={async () => {
                          try {
                            const displayName = anonymousNickname.trim() || 'Anonimowy';
                            await onAddComment(newComment.trim(), undefined, true, displayName);
                            setNewComment("");
                            setAnonymousNickname("");
                            setShowLoginModal(false);
                          } catch (error) {
                            console.error('Error adding anonymous comment:', error);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <User className="w-5 h-5" />
                        <span>Komentuj jako {anonymousNickname.trim() || 'Anonimowy'}</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="w-full px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors duration-200"
                  >
                    Anuluj
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-slate-500">
                    Po zalogowaniu lub wyborze anonimowego komentowania Twój komentarz zostanie automatycznie wysłany
                  </p>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}
