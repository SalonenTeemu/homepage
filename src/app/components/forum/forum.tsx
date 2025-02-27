"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { ForumPost } from "@/app/types/projectTypes";
import { useAuth } from "@/app/context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

export default function Forum() {
	const notificationContext = useNotification();
	const authContext = useAuth();
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [newPost, setNewPost] = useState("");
	const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
	const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
	const [repliesFetched, setRepliesFetched] = useState<{ [key: string]: boolean }>({});
	const [replyFormOpen, setReplyFormOpen] = useState<{ [key: string]: boolean }>({});

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
					body: JSON.stringify({ content: newPost }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);

			if (res) {
				setNewPost("");
				fetchPosts();
				notificationContext?.addNotification("success", "Post sent successfully");
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send post. Please try again later.");
		}
	};

	const sendReply = async (postId: string) => {
		if (!user) {
			notificationContext?.addNotification("error", "You must be logged in to reply.");
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
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send reply.");
		}
	};

	const toggleReplies = (postId: string) => {
		setShowReplies((prev) => {
			const shouldShow = !prev[postId];

			if (shouldShow && !repliesFetched[postId]) {
				fetchReplies(postId);
				setRepliesFetched((prevFetched) => ({ ...prevFetched, [postId]: true }));
			}

			if (!shouldShow) {
				setReplyFormOpen((prev) => ({ ...prev, [postId]: false }));
			}

			return { ...prev, [postId]: shouldShow };
		});
	};

	const toggleReplyForm = (postId: string) => {
		setReplyFormOpen((prev) => {
			const isOpen = !prev[postId];
			if (!isOpen) {
				setReplyContent((prevContent) => ({ ...prevContent, [postId]: "" }));
			}
			return { ...prev, [postId]: isOpen };
		});
		if (!showReplies[postId]) {
			toggleReplies(postId);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-center text-2xl font-bold text-lime-500 selection:text-slate-950">Forum</h1>

			{user ? (
				<div className="mb-6 flex gap-2">
					<input
						type="text"
						className="flex-1 rounded-md border-2 border-slate-700 bg-slate-800 p-3 text-slate-50 placeholder-slate-400 hover:border-lime-500"
						placeholder="Write a new post..."
						value={newPost}
						onChange={(e) => setNewPost(e.target.value)}
					/>
					<button
						onClick={sendPost}
						className="mr-1 rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
					>
						Send
					</button>
				</div>
			) : (
				<p className="text-center text-slate-400">Log in to create a post.</p>
			)}

			<div className="space-y-4">
				{posts.map((post) => (
					<div key={post.id} className="rounded-lg border-2 border-slate-700 p-4 hover:border-lime-500">
						<div className="flex justify-between">
							<p className="font-semibold text-lime-500 selection:text-slate-950">
								@{post.displayName}&nbsp;&nbsp;
								<span className="text-xs font-normal text-slate-400">
									{formatDistanceToNow(new Date(post.createdAt), {
										addSuffix: true,
									})}
								</span>
							</p>
						</div>

						<p className="mt-2 text-slate-50">{post.content}</p>

						<div className="mt-2 flex justify-between">
							{user && (
								<div className="flex gap-2">
									{(post.replyCount ?? 0) > 0 && (
										<p
											onClick={() => toggleReplies(post.id)}
											className="cursor-pointer text-sm font-semibold text-slate-400 transition selection:text-slate-950 hover:text-lime-500"
										>
											{showReplies[post.id] ? "Hide Replies" : "View Replies"}
										</p>
									)}
									<p
										onClick={() => toggleReplyForm(post.id)}
										className={`cursor-pointer text-sm font-semibold text-slate-400 transition selection:text-slate-950 hover:text-lime-500 ${(post.replyCount ?? 0) > 0 ? "ml-1" : ""}`}
									>
										{replyFormOpen[post.id] ? "Close Reply" : "Reply"}
									</p>
								</div>
							)}
							{(post.replyCount ?? 0) > 0 && (
								<p className="text-sm text-slate-400 selection:text-slate-950">
									{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
								</p>
							)}
						</div>

						{((showReplies[post.id] && (post.replies?.length ?? 0) > 0) || replyFormOpen[post.id]) && (
							<div className="ml-5 mt-3 border-l-2 border-slate-600 pl-4">
								{post.replies?.map((reply) => (
									<div key={reply.id} className="ml-1 mt-4 rounded-md bg-slate-950">
										<div className="flex justify-between">
											<p className="font-semibold text-lime-500 selection:text-slate-950">
												@{reply.displayName}&nbsp;&nbsp;
												<span className="text-xs font-normal text-slate-400">
													{formatDistanceToNow(new Date(reply.createdAt), {
														addSuffix: true,
													})}
												</span>
											</p>
										</div>
										<p className="text-slate-50">{reply.content}</p>
									</div>
								))}

								{user && replyFormOpen[post.id] && (
									<div className="mt-2">
										<input
											type="text"
											className="w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-50 placeholder-slate-400 hover:border-lime-500"
											placeholder="Write a reply..."
											value={replyContent[post.id] || ""}
											onChange={(e) =>
												setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
											}
										/>

										<button
											onClick={() => sendReply(post.id)}
											className="mt-2 rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
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
		</div>
	);
}
