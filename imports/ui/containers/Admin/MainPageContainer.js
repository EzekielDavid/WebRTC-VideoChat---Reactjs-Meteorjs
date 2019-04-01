import { createContainer } from 'meteor/react-meteor-data';
import MainPage from '../../pages/Admin/MainPage.js'

export default MainPageContainer = createContainer(({params}) => {
  const currentUser = Meteor.user();
  return {
    currentUser,
  };
}, MainPage);