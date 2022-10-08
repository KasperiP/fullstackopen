import { useEffect, useState } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const Notification = ({ message, type }) => {
	if (message === null) {
		return null;
	}

	if (type === 'error') {
		return (
			<div
				style={{
					color: 'red',
					background: 'pink',
					padding: '10px',
				}}
			>
				{message}
			</div>
		);
	}

	if (type === 'success') {
		return (
			<div
				style={{
					color: 'green',
					background: 'lightgreen',
					padding: '10px',
				}}
			>
				{message}
			</div>
		);
	}
};

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [errMsg, setErrMsg] = useState(null);
	const [message, setMessage] = useState(null);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [blogTitle, setBlogTitle] = useState('');
	const [blogAuthor, setBlogAuthor] = useState('');
	const [blogUrl, setBlogUrl] = useState('');

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, [user]);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogin = async (event) => {
		event.preventDefault();

		try {
			const user = await loginService.login({ username, password });

			window.localStorage.setItem(
				'loggedBlogappUser',
				JSON.stringify(user)
			);
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setErrMsg('wrong credentials');
			setTimeout(() => {
				setErrMsg(null);
			}, 5000);
		}
	};

	const handleLogout = () => {
		window.localStorage.removeItem('loggedBlogappUser');
		blogService.setToken(null);
		setUser(null);
	};

	const handleBlogSubmit = async (event) => {
		event.preventDefault();

		const blogObj = {
			title: blogTitle,
			author: blogAuthor,
			url: blogUrl,
		};

		try {
			const response = await blogService.create(blogObj);
			setBlogs([...blogs, response]);
			setBlogTitle('');
			setBlogAuthor('');
			setBlogUrl('');
			setMessage(
				`a new blog ${response.title} by ${response.author} added`
			);
		} catch (exception) {
			setErrMsg('blog creation failed');
			setTimeout(() => {
				setErrMsg(null);
			}, 5000);
		}
	};

	if (!user) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification message={errMsg} type={'error'} />
				<form onSubmit={handleLogin}>
					<div>
						Username{' '}
						<input
							type="text"
							value={username}
							onChange={({ target }) => setUsername(target.value)}
						/>
					</div>
					<div>
						Password{' '}
						<input
							type="password"
							value={password}
							onChange={({ target }) => setPassword(target.value)}
						/>
					</div>
					<button type="submit">login</button>
				</form>
			</div>
		);
	}

	return (
		<div>
			<h2>blogs</h2>
			<Notification message={errMsg} type={'error'} />
			<Notification message={message} type={'success'} />
			<p>{user.name} logged in</p>
			<button onClick={handleLogout}>logout</button>

			<div>
				<h2>create new</h2>
				<form onSubmit={handleBlogSubmit}>
					<div>
						title{' '}
						<input
							value={blogTitle}
							onChange={({ target }) =>
								setBlogTitle(target.value)
							}
							name="blogTitle"
						/>
					</div>
					<div>
						author{' '}
						<input
							value={blogAuthor}
							onChange={({ target }) =>
								setBlogAuthor(target.value)
							}
							name="blogAuthor"
						/>
					</div>
					<div>
						url{' '}
						<input
							value={blogUrl}
							onChange={({ target }) => setBlogUrl(target.value)}
							name="blogUrl"
						/>
					</div>
					<button type="submit">create</button>
				</form>
			</div>

			{blogs.map((blog) => (
				<Blog key={blog.id} blog={blog} />
			))}
		</div>
	);
};

export default App;
