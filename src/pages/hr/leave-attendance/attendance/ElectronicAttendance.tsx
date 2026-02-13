import { Link } from 'react-router-dom';
const ElectronicAttendance = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Electronic Attendance</h1>
    <p className="text-gray-600 dark:text-gray-400">Form 36: Biometric attendance records</p>
    <Link to="/hr/leave-attendance" className="text-primary-500">Back to Leave & Attendance Dashboard</Link>
  </div>
);
export default ElectronicAttendance;
