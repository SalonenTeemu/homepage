"use client";

import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import { ForumPost } from "@/app/types/projectTypes";
import { useAuth } from "@/app/context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "@/app/utils/apiUtils";

/**
 * The forum component.
 *
 * @returns {JSX.Element} The forum component
 */
export default function Forum() {
	const notificationContext = useNotification();
	const authContext = useAuth();
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [newPost, setNewPost] = useState("");
	const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
	const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
	const [repliesFetched, setRepliesFetched] = useState<{ [key: string]: boolean }>({});
	const [replyFormOpen, setReplyFormOpen] = useState<{ [key: string]: boolean }>({});
	const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});

	const user = authContext?.user;
	const menuRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
		fetchPosts();
	}, [user]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			Object.keys(menuRef.current).forEach((postId) => {
				if (menuRef.current[postId] && !menuRef.current[postId]?.contains(event.target as Node)) {
					setMenuOpen((prev) => ({ ...prev, [postId]: false }));
				}
			});
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	/**
	 * Fetches the posts from the server.
	 */
	const fetchPosts = async () => {
		try {
			const res = await fetch("/api/forum");
			const data = await res.json();
			setPosts(data);
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to fetch posts");
		}
	};

	/**
	 * Fetches the replies for a post.
	 *
	 * @param postId The post ID to fetch replies for
	 */
	const fetchReplies = async (postId: string) => {
		try {
			const res = await fetch(`/api/forum?threadId=${postId}`);
			const data = await res.json();
			setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, replies: data } : post)));
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to fetch replies");
		}
	};

	/**
	 * Sends a new post to the server.
	 */
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
				const data = await res.json();

				if (res.ok) {
					fetchPosts();
					setNewPost("");
					notificationContext?.addNotification("success", "Post sent successfully");
				} else {
					notificationContext?.addNotification("error", `Failed to send post. ${data.response}.`);
				}
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send post. Please try again later.");
		}
	};

	/**
	 * Sends a reply to a post.
	 *
	 * @param postId The post ID to send the reply to
	 */
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
				const data = await res.json();
				if (res.ok) {
					fetchReplies(postId);
					setReplyContent((prev) => ({ ...prev, [postId]: "" }));
					notificationContext?.addNotification("success", "Reply sent successfully");
				} else {
					notificationContext?.addNotification("error", `Failed to send reply. ${data.response}.`);
				}
			}
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to send reply.");
		}
	};

	/**
	 * Toggles the replies for a post.
	 *
	 * @param postId The post ID to toggle replies for
	 */
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

	/**
	 * Toggles the reply form for a post.
	 *
	 * @param postId The post ID to toggle the reply form for
	 */
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

	/**
	 * Toggle the menu for a post.
	 *
	 * @param postId The post ID to toggle the menu for
	 */
	const toggleMenu = (postId: string) => {
		setMenuOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
	};

	/**
	 * Deletes a post.
	 *
	 * @param postId The post ID to delete.
	 * @param isReply Whether the post is a reply or not.
	 */
	const deletePost = async (postId: string, isReply: boolean) => {
		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: postId }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);

			if (res) {
				if (!res.ok) {
					const data = await res.json();
					notificationContext?.addNotification("error", `Failed to delete post. ${data.response}.`);
				} else {
					if (!isReply) {
						setPosts((prev) => prev.filter((post) => post.id !== postId));
					} else {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.replies?.some((reply) => reply.id === postId)
									? {
											...post,
											replies: post.replies?.filter((reply) => reply.id !== postId),
										}
									: post
							)
						);
					}
					notificationContext?.addNotification("success", "Post deleted successfully");
				}
			}
			setMenuOpen((prev) => ({ ...prev, [postId]: false }));
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to delete post.");
			setMenuOpen((prev) => ({ ...prev, [postId]: false }));
		}
	};

	/**
	 * Edits a post.
	 *
	 * @param postId The post ID to edit.
	 * @param isReply Whether the post is a reply or not.
	 */
	const editPost = async (postId: string, isReply: boolean) => {
		const content = prompt("Edit post content:");
		if (!content) return;

		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: postId, content }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);
			if (res) {
				if (!res.ok) {
					const data = await res.json();
					notificationContext?.addNotification("error", `Failed to edit post. ${data.response}.`);
				} else {
					if (!isReply) {
						setPosts((prevPosts) =>
							prevPosts.map((post) => (post.id === postId ? { ...post, content } : post))
						);
					} else {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.replies?.some((reply) => reply.id === postId)
									? {
											...post,
											replies: post.replies?.map((reply) =>
												reply.id === postId ? { ...reply, content } : reply
											),
										}
									: post
							)
						);
					}
					notificationContext?.addNotification("success", "Post edited successfully");
				}
			}
			setMenuOpen((prev) => ({ ...prev, [postId]: false }));
		} catch (err) {
			notificationContext?.addNotification("error", "Failed to edit post.");
			setMenuOpen((prev) => ({ ...prev, [postId]: false }));
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
				<p className="mb-4 text-center text-slate-400">Log in to create a post.</p>
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

							{user && (user.id === post.userId || user.role === "admin") && (
								<div
									className="relative"
									ref={(el) => {
										menuRef.current[post.id] = el;
									}}
								>
									<button
										onClick={() => toggleMenu(post.id)}
										className="text-xl text-slate-400 hover:text-lime-500"
									>
										⋮
									</button>
									{menuOpen[post.id] && (
										<div className="absolute right-0 w-48 rounded-md bg-slate-800 shadow-lg">
											<button
												onClick={() => editPost(post.id, false)}
												className="mt-2 block w-full px-4 text-left text-slate-50 hover:text-lime-500"
											>
												Edit
											</button>
											<button
												onClick={() => deletePost(post.id, false)}
												className="mb-2 mt-2 block w-full px-4 text-left text-slate-50 hover:text-red-500"
											>
												Delete
											</button>
										</div>
									)}
								</div>
							)}
						</div>

						<p className="mt-2 text-slate-50">{post.content}</p>

						<div className="mt-2 flex justify-between">
							<div className="flex gap-2">
								{(post.replyCount ?? 0) > 0 && (
									<p
										onClick={() => toggleReplies(post.id)}
										className="cursor-pointer text-sm font-semibold text-slate-400 transition selection:text-slate-950 hover:text-lime-500"
									>
										{showReplies[post.id] ? "Hide Replies" : "View Replies"}
									</p>
								)}
								{user && (
									<p
										onClick={() => toggleReplyForm(post.id)}
										className={`cursor-pointer text-sm font-semibold text-slate-400 transition selection:text-slate-950 hover:text-lime-500 ${(post.replyCount ?? 0) > 0 ? "ml-1" : ""}`}
									>
										{replyFormOpen[post.id] ? "Close Reply" : "Reply"}
									</p>
								)}
							</div>
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

											{user && (user.id === reply.userId || user.role === "admin") && (
												<div
													className="relative"
													ref={(el) => {
														menuRef.current[reply.id] = el;
													}}
												>
													<button
														onClick={() => toggleMenu(reply.id)}
														className="text-xl text-slate-400 hover:text-lime-500"
													>
														⋮
													</button>
													{menuOpen[reply.id] && (
														<div className="absolute right-0 w-48 rounded-md bg-slate-800 shadow-lg">
															<button
																onClick={() => editPost(reply.id, true)}
																className="mt-2 block w-full px-4 text-left text-slate-50 hover:text-lime-500"
															>
																Edit
															</button>
															<button
																onClick={() => deletePost(reply.id, true)}
																className="mb-2 mt-2 block w-full px-4 text-left text-slate-50 hover:text-red-500"
															>
																Delete
															</button>
														</div>
													)}
												</div>
											)}
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
