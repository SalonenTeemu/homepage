"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { ForumPost } from "@/app/types/projectTypes";
import { useAuth } from "@/app/context/authContext";
import { useNotification } from "@/app/context/notificationContext";
import { fetchWithAuth } from "@/app/utils/projectsUtils/apiUtils";
import { maxPostLength, isPostValid } from "@/app/utils/utils";

/**
 * The forum component.
 *
 * @returns {JSX.Element} The forum component
 */
export default function Forum() {
	const notificationContext = useNotification();
	const authContext = useAuth();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useState<ForumPost[]>([]);
	const [newPost, setNewPost] = useState("");
	const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
	const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
	const [repliesFetched, setRepliesFetched] = useState<{ [key: string]: boolean }>({});
	const [replyFormOpen, setReplyFormOpen] = useState<{ [key: string]: boolean }>({});
	const [menuOpen, setMenuOpen] = useState<{ [key: string]: boolean }>({});
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [postToDelete, setPostToDelete] = useState<{ id: string; isReply: boolean } | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editContent, setEditContent] = useState("");
	const [editPostId, setEditPostId] = useState<string | null>(null);
	const [isReplyEdit, setIsReplyEdit] = useState(false);
	const [lastEvaluatedKey, setLastEvaluatedKey] = useState<any>(null);
	const [loadingMore, setLoadingMore] = useState(false);
	const [loadingMoreReplies, setLoadingMoreReplies] = useState<{ [key: string]: boolean }>({});
	const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);

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
	 *
	 * @param loadMore Whether to load more posts or not
	 */
	const fetchPosts = async (loadMore = false) => {
		setLoading(true);
		try {
			const res = await fetch(
				`/api/forum?limit=10${loadMore && lastEvaluatedKey ? `&lastEvaluatedKey=${JSON.stringify(lastEvaluatedKey)}` : ""}`
			);
			const data = await res.json();
			setPosts((prev) => (loadMore ? [...prev, ...data.posts] : data.posts));
			setLastEvaluatedKey(data.lastEvaluatedKey);
		} catch {
			notificationContext?.addNotification("error", "Failed to fetch posts.");
		} finally {
			setLoading(false);
		}
	};

	/**
	 * Fetches the replies for a post. If loadMore is true, fetches more replies using the last evaluated key.
	 *
	 * @param postId The post ID to fetch replies for
	 * @param loadMore Whether to load more replies or not
	 * @param postLastEvaluatedKey The last evaluated key for pagination
	 */
	const fetchReplies = async (postId: string, loadMore = false, postLastEvaluatedKey?: any) => {
		try {
			const res = await fetch(
				`/api/forum?threadId=${postId}&limit=10${loadMore && postLastEvaluatedKey ? `&lastEvaluatedKey=${JSON.stringify(postLastEvaluatedKey)}` : ""}`
			);
			const data = await res.json();
			const fetchedReplies = data.replies || [];

			setPosts((prev) =>
				prev.map((post) =>
					post.id === postId
						? {
								...post,
								replies: loadMore ? [...(post.replies || []), ...fetchedReplies] : fetchedReplies,
								lastEvaluatedKey: data.lastEvaluatedKey,
								allRepliesFetched: !data.lastEvaluatedKey,
							}
						: post
				)
			);
		} catch {
			notificationContext?.addNotification("error", "Failed to fetch replies.");
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
		if (!isPostValid(newPost)) {
			notificationContext?.addNotification("error", `Post cannot exceed ${maxPostLength} characters.`);
			return;
		}

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
				const responseData = await res.json();
				const data = responseData.response;

				if (res.ok) {
					setNewPost("");
					setPosts((prev) => [{ ...data, replies: [], replyCount: 0 }, ...prev]);
					notificationContext?.addNotification("success", "Post sent.");
				} else {
					notificationContext?.addNotification("error", `Failed to send post. ${data.response}.`);
				}
			}
		} catch {
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
		if (!isPostValid(replyContent[postId])) {
			notificationContext?.addNotification("error", `Reply cannot exceed ${maxPostLength} characters.`);
			return;
		}

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
				const responseData = await res.json();
				const data = responseData.response;
				if (res.ok) {
					setReplyContent((prev) => ({ ...prev, [postId]: "" }));

					const post = posts.find((post) => post.id === postId);

					let fetchedReplies = false;

					if (
						!repliesFetched[postId] &&
						(!post?.allRepliesFetched ||
							((post.replyCount ?? 0) > 0 && (!post?.replies || post.replies.length === 0)))
					) {
						await fetchReplies(postId);
						fetchedReplies = true;
					}

					const shouldAddDirectly = post?.allRepliesFetched || !post?.replies || post.replies.length === 0;

					if (shouldAddDirectly && !fetchedReplies) {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.id === postId
									? {
											...post,
											replies: [...(post.replies || []), data],
											replyCount: (post.replyCount ?? 0) + 1,
										}
									: post
							)
						);
					} else {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.id === postId
									? {
											...post,
											replyCount: (post.replyCount ?? 0) + 1,
										}
									: post
							)
						);
					}
					setShowReplies((prev) => ({ ...prev, [postId]: true }));
					notificationContext?.addNotification("success", "Reply sent.");
				} else {
					notificationContext?.addNotification("error", `Failed to send reply. ${data.response}.`);
				}
			}
		} catch {
			notificationContext?.addNotification("error", "Failed to send reply.");
		}
	};

	/**
	 * Toggles the replies for a post.
	 *
	 * @param postId The post ID to toggle replies for
	 */
	const toggleReplies = useCallback((postId: string) => {
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
	}, []);

	/**
	 * Toggles the reply form for a post.
	 *
	 * @param postId The post ID to toggle the reply form for
	 */
	const toggleReplyForm = useCallback((postId: string) => {
		setReplyFormOpen((prev) => {
			const isOpen = !prev[postId];
			if (!isOpen) {
				setReplyContent((prevContent) => ({ ...prevContent, [postId]: "" }));
			}
			return { ...prev, [postId]: isOpen };
		});
	}, []);

	/**
	 * Toggle the menu for a post.
	 *
	 * @param postId The post ID to toggle the menu for
	 */
	const toggleMenu = useCallback((postId: string) => {
		setMenuOpen((prev) => ({ ...prev, [postId]: !prev[postId] }));
	}, []);

	/**
	 * Edit a post.
	 *
	 * @param postId The post ID to edit.
	 * @param isReply Whether the post is a reply or not.
	 * @param content The content of the post.
	 */
	const editPost = (postId: string, isReply: boolean, content: string) => {
		setEditPostId(postId);
		setIsReplyEdit(isReply);
		setEditContent(content);
		setIsEditModalOpen(true);
	};

	/**
	 * Handles the editing of a post.
	 */
	const handleEditPost = async () => {
		if (!editPostId) return;

		if (!editContent.trim()) return;
		if (!isPostValid(editContent)) {
			notificationContext?.addNotification("error", `Post cannot exceed ${maxPostLength} characters.`);
			return;
		}

		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id: editPostId, content: editContent }),
				},
				authContext?.logout || (() => {}),
				notificationContext?.addNotification!
			);
			if (res) {
				if (!res.ok) {
					const data = await res.json();
					notificationContext?.addNotification("error", `Failed to edit post. ${data.response}.`);
				} else {
					if (!isReplyEdit) {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.id === editPostId ? { ...post, content: editContent, edited: true } : post
							)
						);
					} else {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.replies?.some((reply) => reply.id === editPostId)
									? {
											...post,
											replies: post.replies?.map((reply) =>
												reply.id === editPostId
													? { ...reply, content: editContent, edited: true }
													: reply
											),
										}
									: post
							)
						);
					}
					notificationContext?.addNotification("success", "Post edited.");
					setMenuOpen((prev) => ({ ...prev, [editPostId]: false }));
					setIsEditModalOpen(false);
					setEditPostId(null);
					setEditContent("");
					setIsReplyEdit(false);
				}
			}
		} catch {
			notificationContext?.addNotification("error", "Failed to edit post.");
			setMenuOpen((prev) => ({ ...prev, [editPostId]: false }));
			setIsEditModalOpen(false);
			setEditPostId(null);
			setEditContent("");
			setIsReplyEdit(false);
		}
	};

	/**
	 * Opens the delete modal for a post.
	 *
	 * @param postId The post ID to delete.
	 * @param isReply Whether the post is a reply or not.
	 */
	const openDeleteModal = (postId: string, isReply: boolean) => {
		setPostToDelete({ id: postId, isReply });
		setIsDeleteModalOpen(true);
	};

	/**
	 * Handles the deletion of a post.
	 */
	const handleDeletePost = async () => {
		if (!postToDelete) return;

		const { id, isReply } = postToDelete;

		try {
			const res = await fetchWithAuth(
				"/api/forum",
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ id }),
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
						setPosts((prev) => prev.filter((post) => post.id !== id));
					} else {
						setPosts((prevPosts) =>
							prevPosts.map((post) =>
								post.replies?.some((reply) => reply.id === id)
									? {
											...post,
											replies: post.replies?.filter((reply) => reply.id !== id),
											replyCount: (post.replyCount ?? 0) - 1,
										}
									: post
							)
						);
					}
					notificationContext?.addNotification("success", "Post deleted.");
				}
			}
			setIsDeleteModalOpen(false);
			setPostToDelete(null);
			setMenuOpen((prev) => ({ ...prev, [id]: false }));
		} catch {
			notificationContext?.addNotification("error", "Failed to delete post.");
			setIsDeleteModalOpen(false);
			setPostToDelete(null);
			setMenuOpen((prev) => ({ ...prev, [id]: false }));
		}
	};

	/**
	 * Toggles the guidelines modal.
	 */
	const toggleGuidelinesModal = () => {
		setIsGuidelinesModalOpen((prev) => !prev);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-center text-2xl font-bold text-lime-500 selection:text-slate-950">Chat Forum</h1>

			{user ? (
				<div className="mb-2 flex flex-col gap-2">
					<div className="flex">
						<input
							type="text"
							className="flex-1 rounded-md border-2 border-slate-700 bg-slate-800 p-3 text-slate-50 placeholder-slate-400 hover:border-lime-500"
							placeholder="Write a new post..."
							value={newPost}
							onChange={(e) => setNewPost(e.target.value)}
						/>
						<button
							onClick={sendPost}
							className="ml-2 mr-1 rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
						>
							Send Post
						</button>
					</div>
					<div className="ml-1 flex items-center text-slate-400 selection:text-slate-950">
						<span>
							{newPost.length}/{maxPostLength}
						</span>
					</div>
				</div>
			) : (
				<p className="mb-2 text-center text-slate-400">Log in to create a post.</p>
			)}

			<div className="mb-2 ml-1 flex items-center text-slate-400 selection:text-slate-950">
				<p
					onClick={toggleGuidelinesModal}
					className="cursor-pointer font-semibold transition hover:text-lime-500"
				>
					{isGuidelinesModalOpen ? "Close Forum Info" : "View Forum Info"}
				</p>
			</div>

			{loading && <p className="text-center text-slate-400">Loading...</p>}

			<div className="space-y-4">
				{isGuidelinesModalOpen && (
					<div className="rounded-lg border-2 border-slate-700 bg-slate-800 p-4">
						<h2 className="text-xl font-bold text-lime-500 selection:text-slate-950">
							Welcome to the Chat Forum!
						</h2>
						<p className="mt-2 text-slate-50">
							This is a space where you can connect with others by posting messages and replying to
							discussions. To participate, you need to be logged in.
						</p>
						<p className="mt-2 font-semibold">Please keep the following in mind:</p>
						<ul className="mt-2 list-inside list-disc text-slate-50">
							<li>
								<span className="font-semibold">Protect your privacy: </span>Avoid sharing personal
								information.
							</li>
							<li>
								<span className="font-semibold">Be respectful: </span>Do not post inappropriate or
								offensive content.
							</li>
							<li>
								<span className="font-semibold">Keep it clean: </span>No spamming. You can post up to 10
								messages per day.
							</li>
							<li>
								<span className="font-semibold">Note: </span>The forum is not actively maintained, so
								issues may occur.
							</li>
						</ul>
						<p className="mt-2 font-semibold text-lime-500 selection:text-slate-950">Happy posting!</p>
					</div>
				)}
				{!loading && posts.length === 0 && <p className="text-center text-slate-400">No posts to display.</p>}
				{posts.map((post) => (
					<div key={post.id} className="rounded-lg border-2 border-slate-700 p-4 hover:border-lime-500">
						<div className="flex justify-between">
							<p className="font-semibold text-lime-500 selection:text-slate-950">
								@{post.displayName}&nbsp;&nbsp;
								<span className="text-xs font-normal text-slate-400">
									{formatDistanceToNow(new Date(post.createdAt), {
										addSuffix: true,
									})}
									{post.edited && " (edited)"}
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
												onClick={() => editPost(post.id, false, post.content)}
												className="mt-2 block w-full px-4 text-left text-slate-50 hover:text-lime-500"
											>
												Edit
											</button>
											<button
												onClick={() => openDeleteModal(post.id, false)}
												className="mb-2 mt-2 block w-full px-4 text-left text-slate-50 hover:text-red-500"
											>
												Delete
											</button>
										</div>
									)}
								</div>
							)}
						</div>

						<p className="mt-2 whitespace-pre-wrap break-words text-slate-50">{post.content}</p>

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
													{reply.edited && " (edited)"}
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
																onClick={() => editPost(reply.id, true, reply.content)}
																className="mt-2 block w-full px-4 text-left text-slate-50 hover:text-lime-500"
															>
																Edit
															</button>
															<button
																onClick={() => openDeleteModal(reply.id, true)}
																className="mb-2 mt-2 block w-full px-4 text-left text-slate-50 hover:text-red-500"
															>
																Delete
															</button>
														</div>
													)}
												</div>
											)}
										</div>
										<p className="whitespace-pre-wrap break-words text-slate-50">{reply.content}</p>
									</div>
								))}

								{post.lastEvaluatedKey && (
									<div className="mb-4 mt-4 flex justify-center">
										<button
											className="rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
											onClick={() => {
												setLoadingMoreReplies((prev) => ({ ...prev, [post.id]: true }));
												fetchReplies(post.id, true, post.lastEvaluatedKey).finally(() =>
													setLoadingMoreReplies((prev) => ({ ...prev, [post.id]: false }))
												);
											}}
										>
											{loadingMoreReplies[post.id] ? "Loading..." : "Load More Replies"}
										</button>
									</div>
								)}

								{user && replyFormOpen[post.id] && (
									<div className="mt-2">
										<div className="flex">
											<input
												type="text"
												className="flex-1 rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-50 placeholder-slate-400 hover:border-lime-500"
												placeholder="Write a reply..."
												value={replyContent[post.id] || ""}
												onChange={(e) =>
													setReplyContent((prev) => ({ ...prev, [post.id]: e.target.value }))
												}
											/>
											<button
												onClick={() => sendReply(post.id)}
												className="ml-2 rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
											>
												Send Reply
											</button>
										</div>
										<div className="flex justify-between text-slate-400">
											<span className="ml-1 mt-1">
												{replyContent[post.id]?.length || 0}/{maxPostLength}
											</span>
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			{posts.length > 0 && lastEvaluatedKey && (
				<div className="mt-4 flex justify-center">
					<button
						className="rounded-md bg-lime-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-lime-600"
						onClick={() => {
							setLoadingMore(true);
							fetchPosts(true).finally(() => setLoadingMore(false));
						}}
					>
						{loadingMore ? "Loading..." : "Load More Posts"}
					</button>
				</div>
			)}
			{isDeleteModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
						<h3 className="text-center text-xl font-semibold text-red-500">Delete Post</h3>
						<p className="mt-4 text-center text-slate-300">
							Are you sure you want to delete this post? This action cannot be undone.
						</p>
						<div className="mt-6 flex justify-between">
							<button
								className="mr-2 w-full rounded-md bg-slate-700 py-2 text-slate-50 hover:bg-slate-600"
								onClick={() => setIsDeleteModalOpen(false)}
							>
								Cancel
							</button>
							<button
								className="ml-2 w-full rounded-md bg-red-500 py-2 text-slate-950 hover:bg-red-600"
								onClick={handleDeletePost}
							>
								Confirm
							</button>
						</div>
					</div>
				</div>
			)}
			{isEditModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
					<div className="w-full max-w-md rounded-lg bg-slate-800 p-6 text-slate-50 shadow-lg">
						<h3 className="text-center text-xl font-semibold text-lime-500">Edit Post</h3>
						<textarea
							className="mt-4 w-full rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-50 placeholder-slate-400 hover:border-lime-500"
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							rows={5}
						/>
						<div className="mt-1 text-right text-slate-400">
							{editContent.length}/{maxPostLength}
						</div>
						<div className="mt-6 flex justify-between">
							<button
								className="mr-2 w-full rounded-md bg-slate-700 py-2 text-slate-50 hover:bg-slate-600"
								onClick={() => setIsEditModalOpen(false)}
							>
								Cancel
							</button>
							<button
								className="ml-2 w-full rounded-md bg-lime-500 py-2 text-slate-950 hover:bg-lime-600"
								onClick={handleEditPost}
							>
								Save
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
