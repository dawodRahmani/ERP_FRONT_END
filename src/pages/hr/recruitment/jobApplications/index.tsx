import { useParams } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import ApplicationList from './ApplicationList';

const JobApplications = () => {
  const { id } = useParams();
  const isNew = window.location.pathname.endsWith('/new');
  if (id || isNew) return <ApplicationForm />;
  return <ApplicationList />;
};

export default JobApplications;
