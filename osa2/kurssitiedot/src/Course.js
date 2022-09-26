const Header = ({ course }) => {
	return <h1>{course}</h1>;
};

const Part = ({ part }) => {
	return (
		<p>
			{part.name} {part.exercises}
		</p>
	);
};

const Content = ({ parts }) => {
	return (
		<div>
			{parts.map((part) => (
				<Part key={part.id} part={part} />
			))}
		</div>
	);
};

const Total = ({ parts }) => {
	const total = parts.reduce((sum, part) => sum + part.exercises, 0);

	return (
		<p>
			<strong>total of {total} exercises</strong>
		</p>
	);
};

export const Course = ({ course }) => {
	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};
