"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Instagram, ExternalLink, Heart, MessageCircle } from "lucide-react";

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  media_type: string;
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export function InstagramFeed() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [userInfo, setUserInfo] = useState<InstagramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Instagram account info
  const INSTAGRAM_USERNAME = "kawane.studio";
  const INSTAGRAM_URL = "https://www.instagram.com/kawane.studio/";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchInstagramData();
    }
  }, [mounted]);

  const fetchInstagramData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have Instagram API credentials
      const hasApiCredentials = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN;

      if (hasApiCredentials) {
        // Use real Instagram API
        await fetchRealInstagramData();
      } else {
        // Use mock data for development
        await fetchMockInstagramData();
      }
    } catch (err) {
      setError("Failed to load Instagram posts");
      console.error("Error fetching Instagram data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealInstagramData = async () => {
    try {
      // Fetch user info
      const userResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user info");
      }

      const userData = await userResponse.json();
      setUserInfo(userData);

      // Fetch user media
      const mediaResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count&limit=12&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN}`
      );

      if (!mediaResponse.ok) {
        throw new Error("Failed to fetch media");
      }

      const mediaData = await mediaResponse.json();
      setPosts(mediaData.data || []);
    } catch (err) {
      console.error("Instagram API error:", err);
      // Fallback to mock data
      await fetchMockInstagramData();
    }
  };

  const fetchMockInstagramData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user info
    const mockUserInfo: InstagramUser = {
      id: "kawane_studio",
      username: "kawane.studio",
      account_type: "BUSINESS",
      media_count: 195,
    };
    setUserInfo(mockUserInfo);

    // Mock posts data
    const mockPosts: InstagramPost[] = [
      {
        id: "1",
        caption:
          "Kawane Studio - Premium Streetwear Collection 🎨 #KawaneStudio #Streetwear #Fashion",
        media_url:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example1/",
        timestamp: new Date().toISOString(),
        like_count: 42,
        comments_count: 8,
      },
      {
        id: "2",
        caption:
          "Behind the scenes at Kawane Studio 📸 #BehindTheScenes #KawaneStudio #Fashion",
        media_url:
          "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example2/",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        like_count: 28,
        comments_count: 5,
      },
      {
        id: "3",
        caption:
          "New arrivals coming soon! Stay tuned for our latest collection 🔥 #NewArrivals #KawaneStudio",
        media_url:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example3/",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        like_count: 35,
        comments_count: 12,
      },
      {
        id: "4",
        caption:
          "Customer spotlight: Amazing feedback from our community 💙 #CustomerLove #KawaneStudio",
        media_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example4/",
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        like_count: 51,
        comments_count: 7,
      },
      {
        id: "5",
        caption:
          "Kawane Studio team working hard on new designs 👨‍🎨 #TeamWork #KawaneStudio #Design",
        media_url:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example5/",
        timestamp: new Date(Date.now() - 345600000).toISOString(),
        like_count: 33,
        comments_count: 4,
      },
      {
        id: "6",
        caption:
          "Limited edition drop coming this week! Don't miss out ⚡ #LimitedEdition #KawaneStudio",
        media_url:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&crop=center",
        media_type: "IMAGE",
        permalink: "https://www.instagram.com/p/example6/",
        timestamp: new Date(Date.now() - 432000000).toISOString(),
        like_count: 67,
        comments_count: 15,
      },
    ];

    setPosts(mockPosts);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const truncateCaption = (caption: string, maxLength: number = 100) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + "...";
  };

  if (!mounted) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
              Social Media
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stay updated with our latest products, behind-the-scenes content,
              and customer stories
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-muted-foreground">
                Loading Instagram feed...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
            Social Media
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Stay updated with our latest products, behind-the-scenes content,
            and customer stories
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Instagram Header - Similar to previous widget */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4 p-6 rounded-lg border border-border bg-card shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-card-foreground">
                  Kawané Studio™
                </h3>
                <p className="text-sm text-muted-foreground">
                  @{INSTAGRAM_USERNAME}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold">
                    {userInfo?.media_count || 195} Posts
                  </span>
                  <span className="font-semibold">12.8K Followers</span>
                  <span className="font-semibold">1 Following</span>
                </div>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <span>Follow</span>
              </a>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <div className="aspect-square bg-muted animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Unable to load posts
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchInstagramData}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Posts Grid - Similar to previous widget */}
          {!loading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  {/* Post Image */}
                  <div className="aspect-square relative overflow-hidden bg-muted">
                    <img
                      src={post.media_url}
                      alt={post.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x400/1f2937/ffffff?text=Kawane+Studio`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                    {/* Post Type Indicator */}
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        {post.media_type === "VIDEO" ? (
                          <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4">
                    <p className="text-sm text-card-foreground mb-3 line-clamp-3">
                      {truncateCaption(post.caption)}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDate(post.timestamp)}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3 h-3" />
                          <span>{post.like_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Post Link */}
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors duration-200"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="text-sm font-medium">View Post</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Instagram className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No posts available
              </h3>
              <p className="text-muted-foreground mb-4">
                Check back later for new content
              </p>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                <span>Visit Instagram</span>
              </a>
            </div>
          )}

          {/* Follow CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-4 p-6 rounded-lg border border-border bg-card">
              <Instagram className="w-6 h-6 text-primary" />
              <div>
                <h3 className="font-semibold text-card-foreground">
                  Follow @{INSTAGRAM_USERNAME}
                </h3>
                <p className="text-sm text-muted-foreground">
                  For the latest updates and behind-the-scenes content
                </p>
              </div>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Follow Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
