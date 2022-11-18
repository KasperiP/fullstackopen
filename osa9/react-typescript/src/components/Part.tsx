import { CoursePart } from '../App';

const Part = ({ part }: { part: CoursePart }) => {
	switch (part.type) {
		case 'groupProject': {
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<p>project exercises: {part.groupProjectCount}</p>
				</div>
			);
		}
		case 'normal': {
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<i>{part.description}</i>
				</div>
			);
		}

		case 'submission': {
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<i>{part.description}</i>
					<p>Submission link: {part.exerciseSubmissionLink}</p>
				</div>
			);
		}
		case 'special': {
			return (
				<div>
					<h3>
						{part.name} {part.exerciseCount}
					</h3>
					<i>{part.description}</i>
					<p>Requirements: {part.requirements.join(', ')}</p>
				</div>
			);
		}
		default: {
			return null;
		}
	}
};

export default Part;
