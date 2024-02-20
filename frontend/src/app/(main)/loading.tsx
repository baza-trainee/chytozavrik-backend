import { Spinner } from 'components/common';
import '../globals.scss';

const Loading = () => (
  <div className="initialLoading">
    <div className="loader">
      <Spinner />
    </div>
  </div>
);
export default Loading;
