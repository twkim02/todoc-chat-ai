import { useState } from 'react';
import { Heart, MessageCircle, Share2, Plus, Search, TrendingUp, ArrowLeft, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';

interface Post {
  id: string;
  author: string;
  authorInitial: string;
  category: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  tags: string[];
}

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [isWriting, setIsWriting] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const [newPost, setNewPost] = useState({
    category: 'Recipes',
    title: '',
    content: '',
    tags: '',
  });

  const mockPosts: Post[] = [
    {
      id: '1',
      author: 'Minji\'s Mom',
      authorInitial: 'M',
      category: 'Recipes',
      title: 'Pumpkin Puree Recipe',
      content: 'A sweet pumpkin puree for 6-month-olds. It\'s soft, sweet, and my baby loves it!',
      image: 'recipe1',
      likes: 24,
      comments: 8,
      timestamp: '2 hours ago',
      tags: ['baby food', 'pumpkin', '6 months'],
    },
    {
      id: '2',
      author: 'Seojun\'s Mom',
      authorInitial: 'S',
      category: 'Tips',
      title: 'Night Sleep Training Success Story',
      content: 'My baby finally sleeps through the night! Sharing my 3-week training journey.',
      likes: 42,
      comments: 15,
      timestamp: '5 hours ago',
      tags: ['sleep', 'night sleep', 'training'],
    },
    {
      id: '3',
      author: 'Hayun\'s Family',
      authorInitial: 'H',
      category: 'Recipes',
      title: 'Beef & Seaweed Baby Food',
      content: 'A nutritious meal with iron-rich beef and seaweed.',
      image: 'recipe2',
      likes: 31,
      comments: 12,
      timestamp: '1 day ago',
      tags: ['baby food', 'beef', 'seaweed'],
    },
    {
      id: '4',
      author: 'Jiu\'s Mom',
      authorInitial: 'J',
      category: 'Support',
      title: 'My baby won\'t nap',
      content: 'My 10-month-old wakes up after just 30 minutes of napping. What should I do?',
      likes: 18,
      comments: 23,
      timestamp: '1 day ago',
      tags: ['sleep', 'nap', '10 months'],
    },
    {
      id: '5',
      author: 'Yunseo\'s Family',
      authorInitial: 'Y',
      category: 'Tips',
      title: 'Recommended Baby Activities',
      content: 'Introducing some fun activities to do with your 8-month-old!',
      likes: 27,
      comments: 9,
      timestamp: '2 days ago',
      tags: ['play', 'development', '8 months'],
    },
  ];

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast.info('Like removed');
      } else {
        newSet.add(postId);
        toast.success('Post liked!');
      }
      return newSet;
    });
  };

  const handleSubmitPost = () => {
    if (!newPost.title || !newPost.content) {
      toast.error('Please enter a title and content.');
      return;
    }

    const post: Post = {
      id: Date.now().toString(),
      author: 'Me',
      authorInitial: 'Me',
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };

    setPosts([post, ...posts]);
    setIsWriting(false);
    setNewPost({ category: 'Recipes', title: '', content: '', tags: '' });
    toast.success('Post created successfully!');
  };

  const allPosts = [...posts, ...mockPosts];

  const filteredPosts = allPosts.filter((post) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'recipe') return post.category === 'Recipes';
    if (activeTab === 'tips') return post.category === 'Tips';
    if (activeTab === 'qna') return post.category === 'Support';
    return true;
  });

  if (isWriting) {
    return (
      <div className="h-full w-full overflow-auto bg-gradient-to-b from-[#FFFDF9] to-[#FFF8F0]">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsWriting(false);
                setNewPost({ category: 'Recipes', title: '', content: '', tags: '' });
              }}
              className="text-gray-600 hover:text-[#6AA6FF]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-[#6AA6FF]">Create New Post</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Board</Label>
              <div className="grid grid-cols-3 gap-2">
                {['Recipes', 'Tips', 'Support'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setNewPost({ ...newPost, category })}
                    className={`
                      py-2 px-3 rounded-lg text-sm font-medium transition-all
                      ${newPost.category === category
                        ? 'bg-[#6AA6FF] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="border-[#6AA6FF]/30"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium mb-2 block">
                Content
              </Label>
              <Textarea
                id="content"
                placeholder="Enter your content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="min-h-[200px] border-[#6AA6FF]/30 resize-none"
              />
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium mb-2 block flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., baby food, 6 months)"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                className="border-[#6AA6FF]/30"
              />
              <p className="text-xs text-gray-500 mt-1">You can enter multiple tags separated by commas (,).</p>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Image attachments are coming soon.</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsWriting(false);
                  setNewPost({ category: 'Recipes', title: '', content: '', tags: '' });
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#6AA6FF] hover:bg-[#5a96ef]"
                onClick={handleSubmitPost}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto bg-gradient-to-b from-[#FFFDF9] to-[#FFF8F0]">
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[#6AA6FF] mb-1">Community</h2>
              <p className="text-sm text-gray-600">Share your parenting experiences</p>
            </div>
            <Button
              className="bg-[#6AA6FF] hover:bg-[#5a96ef] rounded-full"
              size="icon"
              onClick={() => setIsWriting(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 border-[#6AA6FF]/30"
            />
          </div>
        </div>

        <div className="mb-4 bg-white rounded-2xl p-1.5 shadow-md border border-gray-100">
          <div className="grid grid-cols-4 gap-1 relative">
            {['all', 'recipe', 'tips', 'qna'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  relative py-2.5 px-4 rounded-xl text-sm font-medium transition-all duration-200
                  ${activeTab === tab
                    ? 'bg-gradient-to-r from-[#6AA6FF] to-[#9ADBC6] text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#6AA6FF]'
                  }
                `}
              >
                {tab === 'all' && 'All'}
                {tab === 'recipe' && 'Recipes'}
                {tab === 'tips' && 'Tips'}
                {tab === 'qna' && 'Support'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-white shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow overflow-hidden"
              style={{
                transform: `rotate(${Math.random() * 2 - 1}deg)`,
              }}
            >
              {post.image && (
                <div className="aspect-square bg-gradient-to-br from-[#FFC98B]/20 to-[#9ADBC6]/20 flex items-center justify-center p-8">
                  <div className="text-6xl">
                    {post.category === 'Recipes' ? '🍽️' : '📸'}
                  </div>
                </div>
              )}

              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-8 w-8 bg-gradient-to-br from-[#6AA6FF] to-[#9ADBC6]">
                    <AvatarFallback className="text-white text-sm">
                      {post.authorInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{post.author}</p>
                    <p className="text-xs text-gray-500">{post.timestamp}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${ 
                      post.category === 'Recipes'
                        ? 'bg-[#FFC98B]/20 text-[#FFC98B]'
                        : post.category === 'Tips'
                        ? 'bg-[#6AA6FF]/20 text-[#6AA6FF]'
                        : 'bg-[#9ADBC6]/20 text-[#9ADBC6]'
                    }`}
                  >
                    {post.category}
                  </Badge>
                </div>

                <div className="mb-3">
                  <h3 className="mb-1 text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.content}
                  </p>
                </div>

                <div className="flex gap-2 mb-3 flex-wrap">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`gap-2 ${ 
                      likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-600'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${ 
                        likedPosts.has(post.id) ? 'fill-current' : ''
                      }`}
                    />
                    <span className="text-sm">
                      {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                    </span>
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="ml-auto text-gray-600">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-2 border-[#6AA6FF]/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-[#6AA6FF]" />
              <h3 className="text-sm text-[#6AA6FF]">Trending Tags</h3>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['baby food', 'sleep', 'play', 'development', 'baby items', 'health'].map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-[#6AA6FF]/10 border-[#6AA6FF]/30"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}