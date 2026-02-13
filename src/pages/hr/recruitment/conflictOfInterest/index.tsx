import { useParams } from 'react-router-dom';
import COIForm from './COIForm';
import COIList from './COIList';

const ConflictOfInterest = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <COIForm />;
  return <COIList />;
};

export default ConflictOfInterest;
