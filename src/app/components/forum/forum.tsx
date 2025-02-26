"use client";

import { useState, useEffect } from "react";
import { ForumType } from "@/app/types/projectTypes";
import { useAuth } from "@/app/context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

export default function Forum() {
	const notificationContext = useNotification();
	const authContext = useAuth();
	const [posts, setPosts] = useState<ForumType[]>([]);
	const [newPost, setNewPost] = useState("");
	const [selectedPost, setSelectedPost] = useState<string | null>(null);
	const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
	const [showReplyForm, setShowReplyForm] = useState<{ [key: string]: boolean }>({});

	const user = authContext?.user;

	useEffect(() => {
		fetchPosts();
	}, [user]);

	const fetchPosts = async () => {
		try {
			const res = await fetch("/api/forum");
			const data = await res.json();
			setPosts(data);
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to fetch posts");
		}
	};

	const fetchReplies = async (postId: string) => {
		try {
			const res = await fetch(`/api/forum?threadId=${postId}`);
			const data = await res.json();
			setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, replies: data } : post)));
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to fetch replies");
		}
	};

	const sendPost = async () => {
		if (!user) {
			notificationContext?.addNotification("error", "You must be logged in to post.");
			return;
		}
		if (!newPost.trim()) return;

		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: newPost, threadId: selectedPost }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);

			if (res) {
				setNewPost("");
				setSelectedPost(null);
				fetchPosts();
				notificationContext?.addNotification("success", "Post sent successfully");
			} else {
				notificationContext?.addNotification(
					"error",
					"Error sending post. Session expired or too many requests."
				);
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send post. Please try again later.");
		}
	};

	const sendReply = async (postId: string) => {
		if (!user) {
			notificationContext?.addNotification("error", "You must be logged in to post.");
			return;
		}
		if (!replyContent[postId]?.trim()) return;

		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ content: replyContent[postId], threadId: postId }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);

			if (res) {
				setReplyContent((prev) => ({ ...prev, [postId]: "" }));
				fetchReplies(postId);
				notificationContext?.addNotification("success", "Reply sent successfully");
			} else {
				notificationContext?.addNotification(
					"error",
					"Error sending reply. Session expired or too many requests."
				);
			}

			if (res) {
				setNewPost("");
				setSelectedPost(null);
				fetchPosts();
				notificationContext?.addNotification("success", "Post sent successfully");
			} else {
				notificationContext?.addNotification(
					"error",
					"Error sending post. Session expired or too many requests."
				);
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send post. Please try again later.");
		}
	};

	const toggleReplyForm = (postId: string) => {
		setShowReplyForm((prev) => ({ ...prev, [postId]: !prev[postId] }));
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-center text-2xl font-bold text-lime-500">Forum</h1>
			{user ? (
				<div className="mb-6 flex gap-2">
					<input
						type="text"
						className="flex-1 rounded-md border border-slate-600 bg-slate-800 p-3 text-slate-50 placeholder-slate-400 focus:border-lime-400 focus:ring focus:ring-lime-500/50"
						placeholder="Write a new post..."
						value={newPost}
						onChange={(e) => setNewPost(e.target.value)}
					/>
					<button
						onClick={sendPost}
						className="rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-lime-400"
					>
						Send
					</button>
				</div>
			) : (
				<p className="text-center text-slate-400">Log in to create a post.</p>
			)}
			<div className="space-y-4">
				{Array.isArray(posts) &&
					posts.map((post) => (
						<div
							key={post.id}
							className="cursor-pointer rounded-lg border-2 border-slate-700 p-4 hover:border-lime-500"
							onClick={() => setSelectedPost(post.id)}
						>
							<h2 className="font-semibold text-lime-400">{post.displayName}</h2>
							<p className="text-sm text-slate-400">{new Date(post.createdAt).toLocaleString()}</p>
							<p className="text-slate-300">{post.content}</p>
							<p className="text-sm text-slate-400">{post.replies ? post.replies.length : 0} replies</p>

							{user && (
								<div className="mt-4">
									<p
										onClick={() => toggleReplyForm(post.id)}
										className="px-4 py-2 text-sm font-semibold text-slate-400 transition hover:bg-lime-500"
									>
										Reply
									</p>
									{showReplyForm[post.id] && (
										<div className="mt-2">
											<input
												type="text"
												className="w-full rounded-md border border-slate-600 bg-slate-800 p-2 text-slate-50 placeholder-slate-400 focus:border-lime-400 focus:ring focus:ring-lime-500/50"
												placeholder="Write a reply..."
												value={replyContent[post.id] || ""}
												onChange={(e) =>
													setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
												}
											/>
											<button
												onClick={() => sendReply(post.id)}
												className="mt-2 rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-lime-400"
											>
												Send Reply
											</button>
										</div>
									)}
								</div>
							)}
						</div>
					))}
			</div>
			{selectedPost && (
				<div className="mt-6 rounded-lg border border-slate-700 bg-slate-800 p-4">
					<h2 className="font-semibold text-lime-400">Replies</h2>
					{posts
						.find((post) => post.id === selectedPost)
						?.replies?.map((reply: any) => (
							<div
								key={reply.id}
								className="mt-2 rounded-md border border-slate-700 bg-slate-800 p-3 text-sm"
							>
								<p className="font-semibold text-lime-400">{reply.displayName}:</p>
								<p className="text-slate-300">{reply.content}</p>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
