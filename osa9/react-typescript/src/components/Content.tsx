import { CoursePart } from '../App';
import Part from './Part';

interface ContentProps {
	courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
	return (
		<>
			{courseParts.map((part) => (
				<Part key={part.name} part={part} />
			))}
		</>
	);
};

export default Content;
